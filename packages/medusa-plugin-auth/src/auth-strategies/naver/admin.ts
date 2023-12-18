import { Strategy as NaverStrategy } from 'passport-naver';
import { ConfigModule, MedusaContainer } from '@medusajs/medusa/dist/types/global';
import { Router } from 'express';
import { NAVER_ADMIN_STRATEGY_NAME, NaverAuthOptions, Profile } from './types';
import { PassportStrategy } from '../../core/passport/Strategy';
import { validateAdminCallback } from '../../core/validate-callback';
import { passportAuthRoutesBuilder } from '../../core/passport/utils/auth-routes-builder';
import { AuthOptions } from '../../types';

export class NaverAdminStrategy extends PassportStrategy(NaverStrategy, NAVER_ADMIN_STRATEGY_NAME) {
	constructor(
		protected readonly container: MedusaContainer,
		protected readonly configModule: ConfigModule,
		protected readonly strategyOptions: NaverAuthOptions,
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
			strategyErrorIdentifier: 'naver',
			strict: this.strict,
		});
	}
}

/**
 * Return the router that hold the naver admin authentication routes
 * @param naver
 * @param configModule
 */
export function getNaverAdminAuthRouter(naver: NaverAuthOptions, configModule: ConfigModule): Router {
	return passportAuthRoutesBuilder({
		domain: 'admin',
		configModule,
		authPath: naver.admin.authPath ?? '/admin/auth/naver',
		authCallbackPath: naver.admin.authCallbackPath ?? '/admin/auth/naver/cb',
		successRedirect: naver.admin.successRedirect,
		strategyName: NAVER_ADMIN_STRATEGY_NAME,
		passportAuthenticateMiddlewareOptions: {
			scope: [
				'email',
			],
		},
		passportCallbackAuthenticateMiddlewareOptions: {
			failureRedirect: naver.admin.failureRedirect,
		},
		expiresIn: naver.admin.expiresIn,
	});
}
