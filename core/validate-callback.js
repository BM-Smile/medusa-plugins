"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateStoreCallback = exports.validateAdminCallback = void 0;
const crypto_1 = __importDefault(require("crypto"));
const medusa_core_utils_1 = require("medusa-core-utils");
const types_1 = require("../types");
/**
 * Default validate callback used by an admin passport strategy
 *
 * @param profile
 * @param container
 * @param strategyErrorIdentifier
 * @param strict
 */
async function validateAdminCallback(profile, { container, strategyErrorIdentifier, strict, }) {
    var _a, _b;
    const userService = container.resolve('userService');
    const email = (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value;
    if (!email) {
        throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.NOT_ALLOWED, `Your ${capitalize(strategyErrorIdentifier)} account does not contains any email and cannot be used`);
    }
    const user = await userService.retrieveByEmail(email).catch(() => void 0);
    if (user) {
        strict !== null && strict !== void 0 ? strict : (strict = 'all');
        if ((strict === 'all' || strict === 'admin') &&
            (!user.metadata || user.metadata[types_1.AUTH_PROVIDER_KEY] !== types_1.strategyNames[strategyErrorIdentifier].admin)) {
            throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.INVALID_DATA, `Admin with email ${email} already exists`);
        }
    }
    else {
        throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.NOT_ALLOWED, `Unable to authenticate the user with the email ${email}`);
    }
    return { id: user.id };
}
exports.validateAdminCallback = validateAdminCallback;
/**
 * Default validate callback used by a store passport strategy
 *
 * @param profile
 * @param strategyErrorIdentifier It will be used to compose the error message in case of an error (e.g Google, Facebook)
 * @param container
 * @param strict
 */
async function validateStoreCallback(profile, { container, strategyErrorIdentifier, strict, }) {
    const manager = container.resolve('manager');
    const customerService = container.resolve('customerService');
    return await manager.transaction(async (transactionManager) => {
        var _a, _b, _c;
        const email = `kko_${profile.id}`;
        const hasEmailVerifiedField = ((_a = profile._json) === null || _a === void 0 ? void 0 : _a.email_verified) !== undefined;
        if (!email) {
            throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.NOT_ALLOWED, `Your ${capitalize(strategyErrorIdentifier)} account does not contains any email and cannot be used`);
        }
        let customer = await customerService
            .withTransaction(transactionManager)
            .retrieveRegisteredByEmail(email)
            .catch(() => void 0);
        if (customer) {
            // To prevent Legacy applications from not authenticating because only CUSTOMER_METADATA_KEY was set
            if (customer.metadata &&
                customer.metadata[types_1.CUSTOMER_METADATA_KEY] &&
                !customer.metadata[types_1.AUTH_PROVIDER_KEY]) {
                customer.metadata[types_1.AUTH_PROVIDER_KEY] = types_1.strategyNames[strategyErrorIdentifier].store;
                await customerService.withTransaction(transactionManager).update(customer.id, {
                    metadata: customer.metadata,
                });
            }
            if (hasEmailVerifiedField &&
                customer.metadata &&
                customer.metadata[types_1.CUSTOMER_METADATA_KEY] &&
                !customer.metadata[types_1.EMAIL_VERIFIED_KEY]) {
                customer.metadata[types_1.EMAIL_VERIFIED_KEY] = profile._json.email_verified;
                await customerService.withTransaction(transactionManager).update(customer.id, {
                    metadata: customer.metadata,
                });
            }
            strict !== null && strict !== void 0 ? strict : (strict = 'all');
            if ((strict === 'all' || strict === 'store') &&
                (!customer.metadata ||
                    !customer.metadata[types_1.CUSTOMER_METADATA_KEY] ||
                    customer.metadata[types_1.AUTH_PROVIDER_KEY] !== types_1.strategyNames[strategyErrorIdentifier].store)) {
                throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.INVALID_DATA, `Customer with email ${email} already exists`);
            }
            else {
                return { id: customer.id };
            }
        }
        const generatePassword = () => {
            const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$';
            return Array.from(crypto_1.default.randomFillSync(new Uint32Array(20)))
                .map((x) => characters[x % characters.length])
                .join('');
        };
        customer = await customerService.withTransaction(transactionManager).create({
            email,
            metadata: {
                [types_1.CUSTOMER_METADATA_KEY]: true,
                [types_1.AUTH_PROVIDER_KEY]: types_1.strategyNames[strategyErrorIdentifier].store,
                [types_1.EMAIL_VERIFIED_KEY]: hasEmailVerifiedField ? profile._json.email_verified : false,
            },
            first_name: (_b = profile.username) !== null && _b !== void 0 ? _b : '',
            last_name: (_c = profile.username) !== null && _c !== void 0 ? _c : '',
            has_account: true,
            password: generatePassword(),
        });
        return { id: customer.id };
    });
}
exports.validateStoreCallback = validateStoreCallback;
function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}
//# sourceMappingURL=validate-callback.js.map