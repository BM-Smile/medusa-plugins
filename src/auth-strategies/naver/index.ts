import { AuthOptions, StrategyExport } from '../../types';
import { Router } from 'express';
import { getNaverAdminAuthRouter, NaverAdminStrategy } from './admin';
import { ConfigModule, MedusaContainer } from '@medusajs/medusa/dist/types/global';
import { getNaverStoreAuthRouter, NaverStoreStrategy } from './store';

export * from './types';
export * from './admin';
export * from './store';

export default {
	load: (container: MedusaContainer, configModule: ConfigModule, options: AuthOptions): void => {
		if (options.naver?.admin) {
			new NaverAdminStrategy(container, configModule, options.naver, options.strict);
		}

		if (options.naver?.store) {
			new NaverStoreStrategy(container, configModule, options.naver, options.strict);
		}
	},
	getRouter: (configModule: ConfigModule, options: AuthOptions): Router[] => {
		const routers = [];

		if (options.naver?.admin) {
			routers.push(getNaverAdminAuthRouter(options.naver, configModule));
		}

		if (options.naver?.store) {
			routers.push(getNaverStoreAuthRouter(options.naver, configModule));
		}

		return routers;
	},
} as StrategyExport;
