import { MedusaContainer } from '@medusajs/medusa/dist/types/global';
import { AuthOptions } from '../../types';

export const NAVER_STORE_STRATEGY_NAME = 'naver.store.medusa-auth-plugin';
export const NAVER_ADMIN_STRATEGY_NAME = 'naver.admin.medusa-auth-plugin';

export type Profile = { emails: { value: string }[]; name?: { givenName?: string; familyName?: string } };

export type NaverAuthOptions = {
	clientID: string;
	clientSecret: string;
	admin?: {
		callbackUrl: string;
		successRedirect: string;
		failureRedirect: string;
		/**
		 * Default /admin/auth/naver
		 */
		authPath?: string;
		/**
		 * Default /admin/auth/naver/cb
		 */
		authCallbackPath?: string;
		/**
		 * The default verify callback function will be used if this configuration is not specified
		 */
		verifyCallback?: (
			container: MedusaContainer,
			req: Request,
			accessToken: string,
			refreshToken: string,
			profile: Profile,
			strict?: AuthOptions['strict']
		) => Promise<null | { id: string } | never>;

		expiresIn?: number;
	};
	store?: {
		callbackUrl: string;
		successRedirect: string;
		failureRedirect: string;
		/**
		 * Default /store/auth/naver
		 */
		authPath?: string;
		/**
		 * Default /store/auth/naver/cb
		 */
		authCallbackPath?: string;
		/**
		 * The default verify callback function will be used if this configuration is not specified
		 */
		verifyCallback?: (
			container: MedusaContainer,
			req: Request,
			accessToken: string,
			refreshToken: string,
			profile: Profile,
			strict?: AuthOptions['strict']
		) => Promise<null | { id: string } | never>;

		expiresIn?: number;
	};
};
