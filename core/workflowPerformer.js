/* eslint-env browser, node */
const { BrowserController } = require('./browserController');
const {
	LogUtility,
	randomInt,
	sleep,
	addReplaceAllToStringPrototype,
} = require('../resources/utilities');
const {
	AssertFailError,
	UnknownWorkFunctionError,
	IncorrectArgumentError,
	NullBrowserError,
} = require('../resources/errors');
const strings = require('../resources/strings');

exports.WorkflowPerformer = class WorkflowPerformer {
	constructor({
		options = null,
	} = {
		options: null,
	}) {
		(new LogUtility()).addToContext(this);
		addReplaceAllToStringPrototype();

		this.__tempCtx = null;

		Object.assign(this, options);
	}

	async setBrowserController(browserController = null) {
		if (!(browserController instanceof BrowserController)) {
			throw new IncorrectArgumentError({
				found: browserController,
				expected: BrowserController,
			});
		}

		this.__browserController = browserController;

		if (this.__browserController.browser === null) {
			throw new NullBrowserError();
		}

		this.browser = this.__browserController.getBrowser();
		this.workingPage = this.__browserController.getWorkingPage();
		this.emulateMobile = this.__browserController.emulateMobile;
	}

	async perform(workflow, ctx = null) {
		// if a previous ctx was set up, clear that to prevent pollution
		if (this.__tempCtx instanceof Object) {
			Object.keys(this.__tempCtx).forEach((key) => {
				this[key] = undefined;
			});
		}

		// set up ctx with variables from "this" to be used
		if (ctx instanceof Object) {
			this.__tempCtx = ctx;
			Object.assign(this, this.__tempCtx);
		}

		// using es6 function declaration as it uses 'this' which is reassigned in
		// traditional 'function' functions
		const doAction = ({
			action,
			selector,
			options,
		}) => {
			this.log(`${action}: ${selector}: ${options}`);

			switch (action) {
			case 'href':
				return this.__href(options);
			case 'click':
				return this.__click(selector);
			case 'type':
				return this.__type(selector, options);
			case 'assertThrow':
				return this.__assertThrow(selector, options);
			case 'assert':
				return this.__assert(selector, options);
			case 'assertInvert':
				return this.__assertInvert(selector);
			case 'loop':
				return this.__loop(options);
			case 'skip':
				return this.__skip(options);
			case 'sleep':
				return this.__sleep(options);
			case '':
				return null;
			default:
				throw new UnknownWorkFunctionError();
			}
		};
		await workflow.forAwait(async (work) => {
			if (this.__skipToAnchor !== null) {
				if (this.__skipToAnchor !== work.options.anchor) {
					return;
				}
				this.__skipToAnchor = null;
			}

			if (work.options.if
				&& !(await work.options.if(this))) {
				this.log(strings.general.workflow.IF_CHECK_FAILED);
				return;
			}

			if (work.action instanceof Array) {
				let actionResult = null;

				await work.action.forAwait(async (actionPart) => {
					// if one of the actions return 'false', it stops the execution chain
					if (actionResult === false) {
						return;
					}

					actionResult = await doAction({
						action: actionPart,
						selector: work.selector,
						options: work.options,
					});
				});
				return;
			}
			await doAction(work);
		});
	}

	async $(selector) {
		return this.__browserController.$(selector);
	}

	async $$(selector) {
		return this.__browserController.$$(selector);
	}

	async __sleep({ ms }) {
		return sleep(ms);
	}

	async __skip({ skipToAnchor = null }) {
		this.__skipToAnchor = skipToAnchor;
	}

	async __loop({ until, actions }) {
		if (!(actions instanceof Array)) {
			throw new IncorrectArgumentError({
				found: actions,
				expected: Array,
			});
		}

		let untilResult = false;

		while (!untilResult) {
			// await sleep(1000);
			await this.perform(actions);

			untilResult = await until(this);
		}
	}

	async __assertInvert(selector = null, options) {
		return !(await this.__assert(selector, options));
	}

	async __assertThrow(selector = null, options) {
		const assertResult = await this.__assert(selector, options);

		if (assertResult === false) {
			throw new AssertFailError({
				reason: selector,
			});
		}

		return true;
	}

	async __href({ url }) {
		if (url === await this.workingPage.url()) {
			return;
		}
		await sleep(100);
		await this.workingPage.goto(url, {
			waitUntil: 'load',
		});
	}

	async __type(selector, { string }) {
		await this.__assert(selector);

		let processedString = string;

		if (string.includes('{{')
			&& string.includes('}}')) {
			// eslint-disable-next-line no-eval
			processedString = eval(`this.${string.replaceAll('{{', '}}')}`);
		}

		await this.workingPage.keyboard.type(processedString, {
			delay: randomInt(5, 100),
		});
	}

	async __click(selector) {
		await this.__assert(selector);

		const positions = await this.__getElementPositions(selector);

		if (this.emulateMobile) {
			await this.workingPage.touchscreen.tap(positions.x, positions.y);
		} else {
			await this.workingPage.focus(selector);
			await this.workingPage.click(selector, {
				delay: randomInt(1, 5),
			});
		}
	}

	async __getElementPositions(selector) {
		await this.__assert(selector);

		const element = await this.$(selector);
		const elementBoundingBox = await element.boundingBox();
		const positions = {
			x: elementBoundingBox.x,
			y: elementBoundingBox.y,
		};

		return positions;
	}

	async __assert(selector = null, {
		customAssertCondition = null,
		retry = 1,
	} = {
		customAssertCondition: null,
		retry: 1,
	}) {
		try {
			if (selector === null
				&& customAssertCondition === null) {
				throw new AssertFailError({
					reason: 'null && null',
				});
			}
			if (selector !== null) {
				await this.workingPage.waitForSelector(selector, {
					visible: true,
					timeout: 1000,
				});
			}
			if (customAssertCondition !== null
				&& typeof customAssertCondition === 'function'
				&& await customAssertCondition(this) !== true) {
				throw new AssertFailError({
					reason: customAssertCondition,
				});
			}
			return true;
		} catch (err) {
			if (err.name === 'TimeoutError'
				|| err.name === 'AssertFailError') {
				this.warn(`${strings.errors.ASSERT_FAIL}: ${err.name}: retry: ${retry}`);
				if (retry < 1) {
					return false;
				}
				return this.__assert(selector, {
					customAssertCondition,
					retry: retry - 1,
				});
			}
			throw err;
		}
	}
};
