import { Router } from 'express';
import { ConfigModule, MedusaContainer } from '@medusajs/medusa/dist/types/global';
import { Strategy as NaverStrategy } from 'passport-naver';
import { PassportStrategy } from '../../core/passport/Strategy';
import { NAVER_STORE_STRATEGY_NAME, NaverAuthOptions, Profile } from './types';
import { passportAuthRoutesBuilder } from '../../core/passport/utils/auth-routes-builder';
import { validateStoreCallback } from '../../core/validate-callback';
import { AuthOptions } from '../../types';

export class NaverStoreStrategy extends PassportStrategy(NaverStrategy, NAVER_STORE_STRATEGY_NAME) {
	constructor(
		protected readonly container: MedusaContainer,
		protected readonly configModule: ConfigModule,
		protected readonly strategyOptions: NaverAuthOptions,
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
			strategyErrorIdentifier: 'naver',
			strict: this.strict,
		});
	}
}

/**
 * Return the router that hold the naver store authentication routes
 * @param naver
 * @param configModule
 */
export function getNaverStoreAuthRouter(naver: NaverAuthOptions, configModule: ConfigModule): Router {
	return passportAuthRoutesBuilder({
		domain: 'store',
		configModule,
		authPath: naver.store.authPath ?? '/store/auth/naver',
		authCallbackPath: naver.store.authCallbackPath ?? '/store/auth/naver/cb',
		successRedirect: naver.store.successRedirect,
		strategyName: NAVER_STORE_STRATEGY_NAME,
		passportAuthenticateMiddlewareOptions: {},
		passportCallbackAuthenticateMiddlewareOptions: {
			failureRedirect: naver.store.failureRedirect,
		},
		expiresIn: naver.store.expiresIn,
	});
}
