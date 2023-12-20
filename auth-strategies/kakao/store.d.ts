import { Router } from 'express';
import { ConfigModule, MedusaContainer } from '@medusajs/medusa/dist/types/global';
import { KakaoAuthOptions, Profile } from './types';
import { AuthOptions } from '../../types';
declare const KakaoStoreStrategy_base: new (...args: any[]) => any;
export declare class KakaoStoreStrategy extends KakaoStoreStrategy_base {
    protected readonly container: MedusaContainer;
    protected readonly configModule: ConfigModule;
    protected readonly strategyOptions: KakaoAuthOptions;
    protected readonly strict?: AuthOptions['strict'];
    constructor(container: MedusaContainer, configModule: ConfigModule, strategyOptions: KakaoAuthOptions, strict?: AuthOptions['strict']);
    validate(req: Request, accessToken: string, refreshToken: string, profile: Profile): Promise<null | {
        id: string;
    }>;
}
/**
 * Return the router that hold the kakao store authentication routes
 * @param kakao
 * @param configModule
 */
export declare function getKakaoStoreAuthRouter(kakao: KakaoAuthOptions, configModule: ConfigModule): Router;
export {};
//# sourceMappingURL=store.d.ts.map