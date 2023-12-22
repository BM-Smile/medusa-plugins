"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.strategyNames = exports.TWENTY_FOUR_HOURS_IN_MS = exports.EMAIL_VERIFIED_KEY = exports.AUTH_PROVIDER_KEY = exports.CUSTOMER_METADATA_KEY = void 0;
const google_1 = require("../auth-strategies/google");
const kakao_1 = require("../auth-strategies/kakao");
const naver_1 = require("../auth-strategies/naver");
exports.CUSTOMER_METADATA_KEY = 'useSocialAuth';
exports.AUTH_PROVIDER_KEY = 'authProvider';
exports.EMAIL_VERIFIED_KEY = 'emailVerified';
exports.TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 1000;
exports.strategyNames = {
    google: {
        admin: google_1.GOOGLE_ADMIN_STRATEGY_NAME,
        store: google_1.GOOGLE_STORE_STRATEGY_NAME,
    },
    kakao: {
        admin: kakao_1.KAKAO_ADMIN_STRATEGY_NAME,
        store: kakao_1.KAKAO_STORE_STRATEGY_NAME,
    },
    naver: {
        admin: naver_1.NAVER_ADMIN_STRATEGY_NAME,
        store: naver_1.NAVER_STORE_STRATEGY_NAME,
    },
};
//# sourceMappingURL=index.js.map