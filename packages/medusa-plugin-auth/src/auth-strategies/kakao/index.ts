import { AuthOptions, StrategyExport } from '../../types';
import { Router } from 'express';
import { getKakaoAdminAuthRouter, KakaoAdminStrategy } from './admin';
import { ConfigModule, MedusaContainer } from '@medusajs/medusa/dist/types/global';
import { getKakaoStoreAuthRouter, KakaoStoreStrategy } from './store';

export * from './types';
export * from './admin';
export * from './store';

export default {
	load: (container: MedusaContainer, configModule: ConfigModule, options: AuthOptions): void => {
		if (options.kakao?.admin) {
			new KakaoAdminStrategy(container, configModule, options.kakao, options.strict);
		}

		if (options.kakao?.store) {
			new KakaoStoreStrategy(container, configModule, options.kakao, options.strict);
		}
	},
	getRouter: (configModule: ConfigModule, options: AuthOptions): Router[] => {
		const routers = [];

		if (options.kakao?.admin) {
			routers.push(getKakaoAdminAuthRouter(options.kakao, configModule));
		}

		if (options.kakao?.store) {
			routers.push(getKakaoStoreAuthRouter(options.kakao, configModule));
		}

		return routers;
	},
} as StrategyExport;
