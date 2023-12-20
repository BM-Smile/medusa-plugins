"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNaverStoreAuthRouter = exports.NaverStoreStrategy = void 0;
const passport_naver_1 = require("passport-naver");
const Strategy_1 = require("../../core/passport/Strategy");
const types_1 = require("./types");
const auth_routes_builder_1 = require("../../core/passport/utils/auth-routes-builder");
const validate_callback_1 = require("../../core/validate-callback");
class NaverStoreStrategy extends (0, Strategy_1.PassportStrategy)(passport_naver_1.Strategy, types_1.NAVER_STORE_STRATEGY_NAME) {
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
            strategyErrorIdentifier: 'naver',
            strict: this.strict,
        });
    }
}
exports.NaverStoreStrategy = NaverStoreStrategy;
/**
 * Return the router that hold the naver store authentication routes
 * @param naver
 * @param configModule
 */
function getNaverStoreAuthRouter(naver, configModule) {
    var _a, _b;
    return (0, auth_routes_builder_1.passportAuthRoutesBuilder)({
        domain: 'store',
        configModule,
        authPath: (_a = naver.store.authPath) !== null && _a !== void 0 ? _a : '/store/auth/naver',
        authCallbackPath: (_b = naver.store.authCallbackPath) !== null && _b !== void 0 ? _b : '/store/auth/naver/cb',
        successRedirect: naver.store.successRedirect,
        strategyName: types_1.NAVER_STORE_STRATEGY_NAME,
        passportAuthenticateMiddlewareOptions: {},
        passportCallbackAuthenticateMiddlewareOptions: {
            failureRedirect: naver.store.failureRedirect,
        },
        expiresIn: naver.store.expiresIn,
    });
}
exports.getNaverStoreAuthRouter = getNaverStoreAuthRouter;
//# sourceMappingURL=store.js.map