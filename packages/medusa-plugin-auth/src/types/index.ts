import { ConfigModule, MedusaContainer } from '@medusajs/medusa/dist/types/global';
import { Router } from 'express';
import { GoogleAuthOptions, GOOGLE_ADMIN_STRATEGY_NAME, GOOGLE_STORE_STRATEGY_NAME } from '../auth-strategies/google';
import { KakaoAuthOptions, KAKAO_ADMIN_STRATEGY_NAME, KAKAO_STORE_STRATEGY_NAME } from '../auth-strategies/kakao';
import { NaverAuthOptions, NAVER_ADMIN_STRATEGY_NAME, NAVER_STORE_STRATEGY_NAME } from '../auth-strategies/naver';

export const CUSTOMER_METADATA_KEY = 'useSocialAuth';
export const AUTH_PROVIDER_KEY = 'authProvider';
export const EMAIL_VERIFIED_KEY = 'emailVerified';

export const TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 1000;

export type StrategyExport = {
	load: (container: MedusaContainer, configModule: ConfigModule, options?: unknown) => void;
	getRouter?: (configModule: ConfigModule, options: AuthOptions) => Router[];
};

/**
 * The options to set in the plugin configuration options property in the medusa-config.js file.
 */
export type AuthOptions = ProviderOptions & {
	/**
	 * When set to admin | store | all,  will only allow the user to authenticate using the provider
	 * that has been used to create the account on the domain that strict is set to.
	 *
	 * @default 'all'
	 */
	strict?: 'admin' | 'store' | 'all' | 'none';
};

export type ProviderOptions = {
	google?: GoogleAuthOptions;
	kakao?: KakaoAuthOptions;
	naver?: NaverAuthOptions;
};

export type StrategyErrorIdentifierType = keyof ProviderOptions;
export type StrategyNames = {
	[key in StrategyErrorIdentifierType]: {
		admin: string;
		store: string;
	};
};

export const strategyNames: StrategyNames = {
	google: {
		admin: GOOGLE_ADMIN_STRATEGY_NAME,
		store: GOOGLE_STORE_STRATEGY_NAME,
	},
	kakao: {
		admin: KAKAO_ADMIN_STRATEGY_NAME,
		store: KAKAO_STORE_STRATEGY_NAME,
	},
	naver: {
		admin: NAVER_ADMIN_STRATEGY_NAME,
		store: NAVER_STORE_STRATEGY_NAME,
	},
};
