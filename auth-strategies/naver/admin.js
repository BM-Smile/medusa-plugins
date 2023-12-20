"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNaverAdminAuthRouter = exports.NaverAdminStrategy = void 0;
const passport_naver_1 = require("passport-naver");
const types_1 = require("./types");
const Strategy_1 = require("../../core/passport/Strategy");
const validate_callback_1 = require("../../core/validate-callback");
const auth_routes_builder_1 = require("../../core/passport/utils/auth-routes-builder");
class NaverAdminStrategy extends (0, Strategy_1.PassportStrategy)(passport_naver_1.Strategy, types_1.NAVER_ADMIN_STRATEGY_NAME) {
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
            strategyErrorIdentifier: 'naver',
            strict: this.strict,
        });
    }
}
exports.NaverAdminStrategy = NaverAdminStrategy;
/**
 * Return the router that hold the naver admin authentication routes
 * @param naver
 * @param configModule
 */
function getNaverAdminAuthRouter(naver, configModule) {
    var _a, _b;
    return (0, auth_routes_builder_1.passportAuthRoutesBuilder)({
        domain: 'admin',
        configModule,
        authPath: (_a = naver.admin.authPath) !== null && _a !== void 0 ? _a : '/admin/auth/naver',
        authCallbackPath: (_b = naver.admin.authCallbackPath) !== null && _b !== void 0 ? _b : '/admin/auth/naver/cb',
        successRedirect: naver.admin.successRedirect,
        strategyName: types_1.NAVER_ADMIN_STRATEGY_NAME,
        passportAuthenticateMiddlewareOptions: {},
        passportCallbackAuthenticateMiddlewareOptions: {
            failureRedirect: naver.admin.failureRedirect,
        },
        expiresIn: naver.admin.expiresIn,
    });
}
exports.getNaverAdminAuthRouter = getNaverAdminAuthRouter;
//# sourceMappingURL=admin.js.map