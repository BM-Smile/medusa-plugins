"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKakaoAdminAuthRouter = exports.KakaoAdminStrategy = void 0;
const passport_kakao_1 = require("passport-kakao");
const types_1 = require("./types");
const Strategy_1 = require("../../core/passport/Strategy");
const validate_callback_1 = require("../../core/validate-callback");
const auth_routes_builder_1 = require("../../core/passport/utils/auth-routes-builder");
class KakaoAdminStrategy extends (0, Strategy_1.PassportStrategy)(passport_kakao_1.Strategy, types_1.KAKAO_ADMIN_STRATEGY_NAME) {
    constructor(container, configModule, strategyOptions, strict) {
        super({
            clientID: strategyOptions.clientID,
            clientSecret: strategyOptions.clientSecret,
            callbackURL: strategyOptions.admin.callbackUrl,
            passReqToCallback: true,
        });
        this.container = container;
        this.configModule = configModule;
        this.strategyOptions = strategyOptions;
        this.strict = strict;
    }
    async validate(req, accessToken, refreshToken, profile) {
        if (this.strategyOptions.admin.verifyCallback) {
            return await this.strategyOptions.admin.verifyCallback(this.container, req, accessToken, refreshToken, profile, this.strict);
        }
        return await (0, validate_callback_1.validateAdminCallback)(profile, {
            container: this.container,
            strategyErrorIdentifier: 'kakao',
            strict: this.strict,
        });
    }
}
exports.KakaoAdminStrategy = KakaoAdminStrategy;
/**
 * Return the router that hold the kakao admin authentication routes
 * @param kakao
 * @param configModule
 */
function getKakaoAdminAuthRouter(kakao, configModule) {
    var _a, _b;
    return (0, auth_routes_builder_1.passportAuthRoutesBuilder)({
        domain: 'admin',
        configModule,
        authPath: (_a = kakao.admin.authPath) !== null && _a !== void 0 ? _a : '/admin/auth/kakao',
        authCallbackPath: (_b = kakao.admin.authCallbackPath) !== null && _b !== void 0 ? _b : '/admin/auth/kakao/cb',
        successRedirect: kakao.admin.successRedirect,
        strategyName: types_1.KAKAO_ADMIN_STRATEGY_NAME,
        passportAuthenticateMiddlewareOptions: {},
        passportCallbackAuthenticateMiddlewareOptions: {
            failureRedirect: kakao.admin.failureRedirect,
        },
        expiresIn: kakao.admin.expiresIn,
    });
}
exports.getKakaoAdminAuthRouter = getKakaoAdminAuthRouter;
//# sourceMappingURL=admin.js.map