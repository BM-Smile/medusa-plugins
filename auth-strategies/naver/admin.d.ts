import { ConfigModule, MedusaContainer } from '@medusajs/medusa/dist/types/global';
import { Router } from 'express';
import { NaverAuthOptions, Profile } from './types';
import { AuthOptions } from '../../types';
declare const NaverAdminStrategy_base: new (...args: any[]) => any;
export declare class NaverAdminStrategy extends NaverAdminStrategy_base {
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
 * Return the router that hold the naver admin authentication routes
 * @param naver
 * @param configModule
 */
export declare function getNaverAdminAuthRouter(naver: NaverAuthOptions, configModule: ConfigModule): Router;
export {};
//# sourceMappingURL=admin.d.ts.map