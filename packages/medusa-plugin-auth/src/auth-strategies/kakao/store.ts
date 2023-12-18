import { Router } from 'express';
import { ConfigModule, MedusaContainer } from '@medusajs/medusa/dist/types/global';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import { PassportStrategy } from '../../core/passport/Strategy';
import { KAKAO_STORE_STRATEGY_NAME, KakaoAuthOptions, Profile } from './types';
import { passportAuthRoutesBuilder } from '../../core/passport/utils/auth-routes-builder';
import { validateStoreCallback } from '../../core/validate-callback';
import { AuthOptions } from '../../types';

export class KakaoStoreStrategy extends PassportStrategy(KakaoStrategy, KAKAO_STORE_STRATEGY_NAME) {
	constructor(
		protected readonly container: MedusaContainer,
		protected readonly configModule: ConfigModule,
		protected readonly strategyOptions: KakaoAuthOptions,
		protected readonly strict?: AuthOptions['strict']
	) {
		super({
			clientID: strategyOptions.clientID,
			clientSecret: strategyOptions.clientSecret,
			callbackURL: strategyOptions.store.callbackUrl,
			passReqToCallback: true,
		});
	}

	async validate(
		req: Request,
		accessToken: string,
		refreshToken: string,
		profile: Profile
	): Promise<null | { id: string }> {
		if (this.strategyOptions.store.verifyCallback) {
			return await this.strategyOptions.store.verifyCallback(
				this.container,
				req,
				accessToken,
				refreshToken,
				profile,
				this.strict
			);
		}

		return await validateStoreCallback(profile, {
			container: this.container,
			strategyErrorIdentifier: 'kakao',
			strict: this.strict,
		});
	}
}

/**
 * Return the router that hold the kakao store authentication routes
 * @param kakao
 * @param configModule
 */
export function getKakaoStoreAuthRouter(kakao: KakaoAuthOptions, configModule: ConfigModule): Router {
	return passportAuthRoutesBuilder({
		domain: 'store',
		configModule,
		authPath: kakao.store.authPath ?? '/store/auth/kakao',
		authCallbackPath: kakao.store.authCallbackPath ?? '/store/auth/kakao/cb',
		successRedirect: kakao.store.successRedirect,
		strategyName: KAKAO_STORE_STRATEGY_NAME,
		passportAuthenticateMiddlewareOptions: {
		},
		passportCallbackAuthenticateMiddlewareOptions: {
			failureRedirect: kakao.store.failureRedirect,
		},
		expiresIn: kakao.store.expiresIn,
	});
}
