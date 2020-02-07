const fs = require('fs');
const { promisify } = require('util');
const { LogUtility } = require('./log.utility');
const { ForUtility } = require('./for.utility');
const { sleep } = require('./miscellanious.utility');
const {
	RottenCookiesError,
	IncorrectArgumentError,
} = require('../errors');
const strings = require('../strings');
const paths = require('../paths');

exports.CookieMonsterUtility = class CookieMonsterUtility {
	constructor() {
		(new LogUtility()).addToContext(this);
		(new ForUtility()).addToArrayPrototype();

		this.__stomachPath = paths.internal.COOKIES;
	}

	async eat(cookie = {}) {
		const ctx = this;

		await ctx.__createStomach();

		const jsonCookies = await ctx.vomit();
		const processedJsonCookies = jsonCookies;

		const cookieMush = await chew(cookie);
		await digest(cookieMush);

		ctx.log(strings.general.EATEN_COOKIES);

		async function chew(cookieBits) {
			switch (true) {
			// if it's an array then iterate through them, and eat them recursively
			case cookieBits instanceof Array:
				await cookieBits.forReturn(async (cookieCrumb) => chew(cookieCrumb));
				return processedJsonCookies;
			// if it's a 'Page' object then extract the cookies = that first
			case typeof cookieBits === 'object'
				&& typeof cookieBits.cookies === 'function':
				chew(await cookieBits.cookies());
				return processedJsonCookies;
			case typeof cookieBits === 'object':
				break;
			default:
				throw new IncorrectArgumentError({
					found: cookieBits,
					expected: [Array, Object],
				});
			}

			if (jsonCookies.data.length === 0) {
				processedJsonCookies.data[0] = cookieBits;
			} else {
				const isOldCookie = jsonCookies.data.some((jsonCookie, i) => {
					if (jsonCookie.name === cookieBits.name) {
						processedJsonCookies.data[i] = cookieBits;
						return true;
					}
					return false;
				});
				if (!isOldCookie) {
					// add to end of array
					processedJsonCookies.data[processedJsonCookies.data.length] = cookieBits;
				}
			}
			return null;
		}

		async function digest(cookieBits) {
			await promisify(fs.writeFile)(ctx.__stomachPath, '');
			await promisify(fs.writeFile)(ctx.__stomachPath, JSON.stringify(cookieBits));
		}
	}

	async vomit() {
		await this.__createStomach();

		const rawCookies = await promisify(fs.readFile)(this.__stomachPath);
		let jsonCookies;

		try {
			jsonCookies = JSON.parse(rawCookies);
			if (jsonCookies.data);
		} catch (err) {
			throw new RottenCookiesError();
		}

		return jsonCookies;
	}

	async feedTo(page) {
		const jsonCookies = await this.vomit();

		await jsonCookies.data.forAwait(async (cookie) => {
			await page.setCookie(cookie);
		});
	}

	async __createStomach() {
		if (await promisify(fs.exists)(this.__stomachPath)) {
			return;
		}
		const cookieStashShape = {
			data: [],
		};
		await promisify(fs.writeFile)(this.__stomachPath, JSON.stringify(cookieStashShape));
		await sleep(100);
	}
};
