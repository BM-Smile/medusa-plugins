"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKakaoStoreAuthRouter = exports.KakaoStoreStrategy = void 0;
const passport_kakao_1 = require("passport-kakao");
const Strategy_1 = require("../../core/passport/Strategy");
const types_1 = require("./types");
const auth_routes_builder_1 = require("../../core/passport/utils/auth-routes-builder");
const validate_callback_1 = require("../../core/validate-callback");
class KakaoStoreStrategy extends (0, Strategy_1.PassportStrategy)(passport_kakao_1.Strategy, types_1.KAKAO_STORE_STRATEGY_NAME) {
    constructor(container, configModule, strategyOptions, strict) {
        super({
            clientID: strategyOptions.clientID,
            clientSecret: strategyOptions.clientSecret,
            callbackURL: strategyOptions.store.callbackUrl,
            passReqToCallback: true,
        });
        this.container = container;
        this.configModule = configModule;
        this.strategyOptions = strategyOptions;
        this.strict = strict;
    }
    async validate(req, accessToken, refreshToken, profile) {
        if (this.strategyOptions.store.verifyCallback) {
            return await this.strategyOptions.store.verifyCallback(this.container, req, accessToken, refreshToken, profile, this.strict);
        }
        return await (0, validate_callback_1.validateStoreCallback)(profile, {
            container: this.container,
            strategyErrorIdentifier: 'kakao',
            strict: this.strict,
        });
    }
}
exports.KakaoStoreStrategy = KakaoStoreStrategy;
/**
 * Return the router that hold the kakao store authentication routes
 * @param kakao
 * @param configModule
 */
function getKakaoStoreAuthRouter(kakao, configModule) {
    var _a, _b;
    return (0, auth_routes_builder_1.passportAuthRoutesBuilder)({
        domain: 'store',
        configModule,
        authPath: (_a = kakao.store.authPath) !== null && _a !== void 0 ? _a : '/store/auth/kakao',
        authCallbackPath: (_b = kakao.store.authCallbackPath) !== null && _b !== void 0 ? _b : '/store/auth/kakao/cb',
        successRedirect: kakao.store.successRedirect,
        strategyName: types_1.KAKAO_STORE_STRATEGY_NAME,
        passportAuthenticateMiddlewareOptions: {},
        passportCallbackAuthenticateMiddlewareOptions: {
            failureRedirect: kakao.store.failureRedirect,
        },
        expiresIn: kakao.store.expiresIn,
    });
}
exports.getKakaoStoreAuthRouter = getKakaoStoreAuthRouter;
//# sourceMappingURL=store.js.map