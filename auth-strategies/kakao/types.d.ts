import { MedusaContainer } from '@medusajs/medusa/dist/types/global';
import { AuthOptions } from '../../types';
export declare const KAKAO_STORE_STRATEGY_NAME = "kakao.store.medusa-auth-plugin";
export declare const KAKAO_ADMIN_STRATEGY_NAME = "kakao.admin.medusa-auth-plugin";
export declare type Profile = {
    emails: {
        value: string;
    }[];
    name?: {
        givenName?: string;
        familyName?: string;
    };
};
export declare type KakaoAuthOptions = {
    clientID: string;
    clientSecret: string;
    admin?: {
        callbackUrl: string;
        successRedirect: string;
        failureRedirect: string;
        /**
         * Default /admin/auth/kakao
         */
        authPath?: string;
        /**
         * Default /admin/auth/kakao/cb
         */
        authCallbackPath?: string;
        /**
         * The default verify callback function will be used if this configuration is not specified
         */
        verifyCallback?: (container: MedusaContainer, req: Request, accessToken: string, refreshToken: string, profile: Profile, strict?: AuthOptions['strict']) => Promise<null | {
            id: string;
        } | never>;
        expiresIn?: number;
    };
    store?: {
        callbackUrl: string;
        successRedirect: string;
        failureRedirect: string;
        /**
         * Default /store/auth/kakao
         */
        authPath?: string;
        /**
         * Default /store/auth/kakao/cb
         */
        authCallbackPath?: string;
        /**
         * The default verify callback function will be used if this configuration is not specified
         */
        verifyCallback?: (container: MedusaContainer, req: Request, accessToken: string, refreshToken: string, profile: Profile, strict?: AuthOptions['strict']) => Promise<null | {
            id: string;
        } | never>;
        expiresIn?: number;
    };
};
//# sourceMappingURL=types.d.ts.map