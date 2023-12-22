import { ConfigModule, MedusaContainer } from '@medusajs/medusa/dist/types/global';

import { AuthOptions } from '../types';
import GoogleStrategy from '../auth-strategies/google';
import KakaoStrategy from '../auth-strategies/kakao';
import NaverStrategy from '../auth-strategies/naver';

export default async function authStrategiesLoader(container: MedusaContainer, authOptions: AuthOptions) {
	const configModule = container.resolve('configModule') as ConfigModule;

	GoogleStrategy.load(container, configModule, authOptions);
	KakaoStrategy.load(container, configModule, authOptions);
	NaverStrategy.load(container, configModule, authOptions);
}
