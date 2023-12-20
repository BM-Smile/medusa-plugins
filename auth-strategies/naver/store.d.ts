import { Router } from 'express';
import { ConfigModule, MedusaContainer } from '@medusajs/medusa/dist/types/global';
import { NaverAuthOptions, Profile } from './types';
import { AuthOptions } from '../../types';
declare const NaverStoreStrategy_base: new (...args: any[]) => any;
export declare class NaverStoreStrategy extends NaverStoreStrategy_base {
    protected readonly container: MedusaContainer;
    protected readonly configModule: ConfigModule;
    protected readonly strategyOptions: NaverAuthOptions;
    protected readonly strict?: AuthOptions['strict'];
    constructor(container: MedusaContainer, configModule: ConfigModule, strategyOptions: NaverAuthOptions, strict?: AuthOptions['strict']);
    validate(req: Request, accessToken: string, refreshToken: string, profile: Profile): Promise<null | {
        id: string;
    }>;
}
/**
 * Return the router that hold the naver store authentication routes
 * @param naver
 * @param configModule
 */
export declare function getNaverStoreAuthRouter(naver: NaverAuthOptions, configModule: ConfigModule): Router;
export {};
//# sourceMappingURL=store.d.ts.map