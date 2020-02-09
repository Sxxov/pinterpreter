const puppeteerDevices = require('puppeteer/lib/DeviceDescriptors.js');
const puppeteer = require('puppeteer');
const fs = require('fs');
const { promisify } = require('util');
const paths = require('../resources/paths');
const strings = require('../resources/strings');
const {
	ForUtility,
	LogUtility,
	TasksUtility,
	CookieMonsterUtility,
	sleep,
} = require('../resources/utilities');
const {
	NullBrowserError,
	NullPagesError,
	ClientError,
	BrowserDisconnectedError,
} = require('../resources/errors');

exports.BrowserController = class BrowserController {
	constructor() {
		(new ForUtility()).addToArrayPrototype();
		(new LogUtility()).addToContext(this);

		this.browser = null;
		this.pages = null;
		this.chromeExecutablePath = null;
		this.chromeUserDataDir = null;
		this.paths = paths;
		this.puppeteerExtraArgs = [
			`--disable-extensions-except=${this.__getLoadExtensionsArg()}`,
			'--user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36"',
		];
		this.__intentionalEnd = false;
	}

	async launch({
		saveCookies = this.saveCookies = true,
		tryForUserBrowser = this.tryForUserBrowser = true,
		forceKillChrome = this.forceKillChrome = false,
		emulateMobile = this.emulateMobile = false,

		executablePath = null,
		userDataDir = null,
		headless = this.headless = true,
		...others
	} = {}) {
		// if the user passes undefined, run the function with an empty object instead
		// so the settings can be reflected on to "this"
		if (arguments[0] === undefined) {
			return this.launch({});
		}

		// assign the non empty variable to "this"
		// since it won't assign them while destructuring if they're set
		Object.assign(this, arguments[0]);

		// assign "...others" to "this" to catch the args not set explicitly here
		Object.assign(this, others);

		if (!tryForUserBrowser) {
			this.chromeExecutablePath = null;
			this.chromeUserDataDir = null;
		} else {
			if (doesPathExist(executablePath) !== true) {
				this.chromeExecutablePath = this.paths.chrome.EXECUTABLE;
			}
			if (doesPathExist(userDataDir) !== true) {
				this.chromeUserDataDir = this.paths.chrome.USER_DATA;
			}

			if (this.chromeExecutablePath === null) {
				this.warn(strings.general.CHROME_PATH_NOT_FOUND);
			} else {
				this.log(strings.general.CHROME_PATH_FOUND);

				const killChromeResult = await killChrome(this);

				if (killChromeResult !== true) {
					this.chromeExecutablePath = null;
					this.chromeUserDataDir = null;
				}
			}
		}

		// start the browser with the arguments from above
		this.browser = await puppeteer.launch({
			executablePath: this.chromeExecutablePath,
			userDataDir: this.chromeUserDataDir,
			headless,
			args: this.puppeteerExtraArgs,
			...others,
		});

		// close the disconnect extension first start page
		this.browser.on('targetcreated', async (target) => {
			const page = await target.page();

			// the event is triggered but the target is null
			// this happens when devtools is opened
			if (page === null) {
				return;
			}

			if (!target.url().includes('disconnect')) {
				return;
			}

			await page.close();

			// remove this listener
			this.browser.on('targetcreated', () => {});
		});

		// throw on browser disconnect
		this.browser.on('disconnected', () => {
			if (this.__intentionalEnd === true) {
				return;
			}

			throw new BrowserDisconnectedError();
		});
		this.pages = await this.browser.pages();

		// set up the things that are going to be loaded on new document
		this.getWorkingPage().evaluateOnNewDocument(
			await promisify(fs.readFile)(paths.internal.PRELOAD),
		);

		if (saveCookies) {
			// summon the cookie monster
			const cookieMonster = new CookieMonsterUtility();

			// set up cookies
			await cookieMonster.feedTo(this.getWorkingPage());

			// set up listener to save cookies
			this.browser.on('targetchanged', async (target) => {
				const page = await target.page();

				// the event is triggered but the target is null
				// this happens when devtools is opened
				if (page === null) {
					return;
				}

				await cookieMonster.eat(page);
			});
		}

		if (emulateMobile) {
			// apply "iPhone XR" configuration as the mobile device
			// it's the most modern device in puppeteer's descriptors
			(this.getWorkingPage()).emulate(puppeteerDevices['iPhone XR']);
		}

		return this.browser;


		async function doesPathExist(path) {
			return promisify(fs.exists)(path);
		}

		async function killChrome(ctx) {
			const tasksUtility = new TasksUtility();
			let answer = true;

			if (await tasksUtility.isRunning('chrome', {
				tolerance: 3,
			})) {
				if (!forceKillChrome) {
					answer = await promptToCloseChrome(ctx);
				}
				if (answer === true) {
					await tasksUtility.kill('chrome');
					await sleep(2000);
				}
				return answer;
			}
			return true;
		}

		async function promptToCloseChrome(ctx) {
			const answer = await ctx.ask(strings.general.PROMPT_TO_CLOSE_CHROME, [
				strings.general.CLOSE_CHROME_AND_USE_USER_BROWSER,
				'',
				strings.general.CONTINUE_AND_USE_INTERNAL_BROWSER,
			]);

			switch (answer) {
			case strings.general.CLOSE_CHROME_AND_USE_USER_BROWSER:
				return true;
			case strings.general.CONTINUE_AND_USE_INTERNAL_BROWSER:
				return false;
			default:
				throw new ClientError();
			}
		}
	}

	__getLoadExtensionsArg() {
		const extensionsPath = this.paths.internal.EXTENSIONS;
		const extensionFolders = fs.readdirSync(extensionsPath);
		const arg = [];

		extensionFolders.forEach((extensionFolder) => {
			const extensionFolderPath = `${extensionsPath}/${extensionFolder}`;
			const extensionVersions = fs.readdirSync(extensionFolderPath);

			extensionVersions.sort();
			extensionVersions.reverse();
			arg.push(`${extensionFolderPath}/${extensionVersions[0]}`);
		});
		return arg.join(',');
	}

	async $(selector, functionToEval = null) {
		let queryResult;

		if (functionToEval === null) {
			queryResult = await this.getWorkingPage().$(selector);
		} else {
			queryResult = await this.getWorkingPage().$eval(selector,
				(arrayFrom$) => functionToEval.call(this, arrayFrom$));
		}

		return queryResult;
	}

	async $$(selector, functionToEval = null) {
		let queryResult;

		if (functionToEval === null) {
			queryResult = await this.getWorkingPage().$$(selector);
		} else {
			queryResult = await this.getWorkingPage().$$eval(selector,
				(arrayFrom$) => functionToEval.call(this, arrayFrom$));
		}

		return queryResult;
	}

	getBrowser() {
		const { browser } = this;

		if (browser === null) {
			throw new NullBrowserError();
		}
		return browser;
	}

	getPages() {
		const { pages } = this;

		if (pages === null) {
			throw new NullPagesError();
		}
		return pages;
	}

	getWorkingPage() {
		const pages = this.getPages();

		return pages[pages.length - 1];
	}

	async end() {
		if (this.getBrowser === null
			|| this.getPages === null) {
			return;
		}
		this.__intentionalEnd = true;

		await this.getWorkingPage().close();
		await this.getBrowser().close();
	}
};
