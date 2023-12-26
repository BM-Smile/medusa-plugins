import crypto from 'crypto';
import { CustomerService, UserService } from '@medusajs/medusa';
import { MedusaContainer } from '@medusajs/medusa/dist/types/global';
import { MedusaError } from 'medusa-core-utils';
import { EntityManager } from 'typeorm';
import {
	AUTH_PROVIDER_KEY,
	AuthOptions,
	CUSTOMER_METADATA_KEY,
	EMAIL_VERIFIED_KEY,
	StrategyErrorIdentifierType,
	strategyNames,
} from '../types';

/**
 * Default validate callback used by an admin passport strategy
 *
 * @param profile
 * @param container
 * @param strategyErrorIdentifier
 * @param strict
 */
export async function validateAdminCallback<
	T extends { emails?: { value: string }[] } = {
		emails?: { value: string }[];
	}
>(
	profile: T,
	{
		container,
		strategyErrorIdentifier,
		strict,
	}: {
		container: MedusaContainer;
		strategyErrorIdentifier: StrategyErrorIdentifierType;
		strict?: AuthOptions['strict'];
	}
): Promise<{ id: string } | never> {
	const userService: UserService = container.resolve('userService');
	const email = profile.emails?.[0]?.value;

	if (!email) {
		throw new MedusaError(
			MedusaError.Types.NOT_ALLOWED,
			`Your ${capitalize(strategyErrorIdentifier)} account does not contains any email and cannot be used`
		);
	}

	const user = await userService.retrieveByEmail(email).catch(() => void 0);

	if (user) {
		strict ??= 'all';
		if (
			(strict === 'all' || strict === 'admin') &&
			(!user.metadata || user.metadata[AUTH_PROVIDER_KEY] !== strategyNames[strategyErrorIdentifier].admin)
		) {
			throw new MedusaError(MedusaError.Types.INVALID_DATA, `Admin with email ${email} already exists`);
		}
	} else {
		throw new MedusaError(MedusaError.Types.NOT_ALLOWED, `Unable to authenticate the user with the email ${email}`);
	}

	return { id: user.id };
}

/**
 * Default validate callback used by a store passport strategy
 *
 * @param profile
 * @param strategyErrorIdentifier It will be used to compose the error message in case of an error (e.g Google, Facebook)
 * @param container
 * @param strict
 */
export async function validateStoreCallback<
	T extends {
		name?: { givenName?: string; familyName?: string };
		_json?: {
			email_verified?: boolean;
		};
		emails?: { value: string }[];
		id?: string;
		username?: string;
	} = {
		emails?: { value: string }[];
		id?: string;
	}
>(
	profile: T,
	{
		container,
		strategyErrorIdentifier,
		strict,
	}: {
		container: MedusaContainer;
		strategyErrorIdentifier: StrategyErrorIdentifierType;
		strict?: AuthOptions['strict'];
	}
): Promise<{ id: string } | never> {
	const manager: EntityManager = container.resolve('manager');
	const customerService: CustomerService = container.resolve('customerService');

	return await manager.transaction(async (transactionManager) => {
		let email = profile.id;
		switch (capitalize(strategyErrorIdentifier)) {
			case 'Google':
				email = `ggl_${email}`;
				break;
			case 'Kakao':
				email = `kko_${email}`;
				break;
			case 'Naver':
				email = `nid_${email}`;
				break;
			default:
				email = null;
				break;
		}
		const hasEmailVerifiedField = profile._json?.email_verified !== undefined;

		if (!email) {
			throw new MedusaError(
				MedusaError.Types.NOT_ALLOWED,
				`Your ${capitalize(strategyErrorIdentifier)} account does not contains any email and cannot be used`
			);
		}

		let customer = await customerService
			.withTransaction(transactionManager)
			.retrieveRegisteredByEmail(email)
			.catch(() => void 0);

		if (customer) {
			// To prevent Legacy applications from not authenticating because only CUSTOMER_METADATA_KEY was set
			if (
				customer.metadata &&
				customer.metadata[CUSTOMER_METADATA_KEY] &&
				!customer.metadata[AUTH_PROVIDER_KEY]
			) {
				customer.metadata[AUTH_PROVIDER_KEY] = strategyNames[strategyErrorIdentifier].store;
				await customerService.withTransaction(transactionManager).update(customer.id, {
					metadata: customer.metadata,
				});
			}

			if (
				hasEmailVerifiedField &&
				customer.metadata &&
				customer.metadata[CUSTOMER_METADATA_KEY] &&
				!customer.metadata[EMAIL_VERIFIED_KEY]
			) {
				customer.metadata[EMAIL_VERIFIED_KEY] = profile._json.email_verified;
				await customerService.withTransaction(transactionManager).update(customer.id, {
					metadata: customer.metadata,
				});
			}

			strict ??= 'all';
			if (
				(strict === 'all' || strict === 'store') &&
				(!customer.metadata ||
					!customer.metadata[CUSTOMER_METADATA_KEY] ||
					customer.metadata[AUTH_PROVIDER_KEY] !== strategyNames[strategyErrorIdentifier].store)
			) {
				throw new MedusaError(MedusaError.Types.INVALID_DATA, `Customer with email ${email} already exists`);
			} else {
				return { id: customer.id };
			}
		}

		const generatePassword = () => {
			const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$';
			return Array.from(crypto.randomFillSync(new Uint32Array(20)))
				.map((x) => characters[x % characters.length])
				.join('');
		};

		customer = await customerService.withTransaction(transactionManager).create({
			email,
			metadata: {
				[CUSTOMER_METADATA_KEY]: true,
				[AUTH_PROVIDER_KEY]: strategyNames[strategyErrorIdentifier].store,
				[EMAIL_VERIFIED_KEY]: hasEmailVerifiedField ? profile._json.email_verified : false,
			},
			first_name: profile.username ?? '',
			last_name: profile.username ?? '',
			has_account: true,
			password: generatePassword(),
		});

		return { id: customer.id };
	});
}

function capitalize(s: string) {
	return s.charAt(0).toUpperCase() + s.slice(1);
}
