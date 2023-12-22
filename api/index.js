"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("@medusajs/medusa/dist/loaders/config"));
const google_1 = __importDefault(require("../auth-strategies/google"));
const kakao_1 = __importDefault(require("../auth-strategies/kakao"));
const naver_1 = __importDefault(require("../auth-strategies/naver"));
function default_1(rootDirectory, pluginOptions) {
    const configModule = (0, config_1.default)(rootDirectory);
    return loadRouters(configModule, pluginOptions);
}
exports.default = default_1;
function loadRouters(configModule, options) {
    const routers = [];
    routers.push(...google_1.default.getRouter(configModule, options));
    routers.push(...kakao_1.default.getRouter(configModule, options));
    routers.push(...naver_1.default.getRouter(configModule, options));
    return routers;
}
//# sourceMappingURL=index.js.map