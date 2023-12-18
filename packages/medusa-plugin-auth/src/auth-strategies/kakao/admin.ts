import { Strategy as KakaoStrategy } from 'passport-kakao';
import { ConfigModule, MedusaContainer } from '@medusajs/medusa/dist/types/global';
import { Router } from 'express';
import { KAKAO_ADMIN_STRATEGY_NAME, KakaoAuthOptions, Profile } from './types';
import { PassportStrategy } from '../../core/passport/Strategy';
import { validateAdminCallback } from '../../core/validate-callback';
import { passportAuthRoutesBuilder } from '../../core/passport/utils/auth-routes-builder';
import { AuthOptions } from '../../types';

export class KakaoAdminStrategy extends PassportStrategy(KakaoStrategy, KAKAO_ADMIN_STRATEGY_NAME) {
	constructor(
		protected readonly container: MedusaContainer,
		protected readonly configModule: ConfigModule,
		protected readonly strategyOptions: KakaoAuthOptions,
		protected readonly strict?: AuthOptions['strict']
	) {
		super({
			clientID: strategyOptions.clientID,
			clientSecret: strategyOptions.clientSecret,
			callbackURL: strategyOptions.admin.callbackUrl,
			passReqToCallback: true,
		});
	}

	async validate(
		req: Request,
		accessToken: string,
		refreshToken: string,
		profile: Profile
	): Promise<null | { id: string }> {
		if (this.strategyOptions.admin.verifyCallback) {
			return await this.strategyOptions.admin.verifyCallback(
				this.container,
				req,
				accessToken,
				refreshToken,
				profile,
				this.strict
			);
		}

		return await validateAdminCallback(profile, {
			container: this.container,
			strategyErrorIdentifier: 'kakao',
			strict: this.strict,
		});
	}
}

/**
 * Return the router that hold the kakao admin authentication routes
 * @param kakao
 * @param configModule
 */
export function getKakaoAdminAuthRouter(kakao: KakaoAuthOptions, configModule: ConfigModule): Router {
	return passportAuthRoutesBuilder({
		domain: 'admin',
		configModule,
		authPath: kakao.admin.authPath ?? '/admin/auth/kakao',
		authCallbackPath: kakao.admin.authCallbackPath ?? '/admin/auth/kakao/cb',
		successRedirect: kakao.admin.successRedirect,
		strategyName: KAKAO_ADMIN_STRATEGY_NAME,
		passportAuthenticateMiddlewareOptions: {
			scope: [
				'email',
			],
		},
		passportCallbackAuthenticateMiddlewareOptions: {
			failureRedirect: kakao.admin.failureRedirect,
		},
		expiresIn: kakao.admin.expiresIn,
	});
}
