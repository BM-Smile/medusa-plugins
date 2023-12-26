import { Router } from 'express';
import { ConfigModule } from '@medusajs/medusa/dist/types/global';
import loadConfig from '@medusajs/medusa/dist/loaders/config';
import GoogleStrategy from '../auth-strategies/google';
import KakaoStrategy from '../auth-strategies/kakao';
import NaverStrategy from '../auth-strategies/naver';

import { AuthOptions } from '../types';

export default function (rootDirectory, pluginOptions: AuthOptions): Router[] {
	const configModule = loadConfig(rootDirectory) as ConfigModule;
	return loadRouters(configModule, pluginOptions);
}

function loadRouters(configModule: ConfigModule, options: AuthOptions): Router[] {
	const routers: Router[] = [];

	routers.push(...GoogleStrategy.getRouter(configModule, options));
	routers.push(...KakaoStrategy.getRouter(configModule, options));
	routers.push(...NaverStrategy.getRouter(configModule, options));

	return routers;
}
