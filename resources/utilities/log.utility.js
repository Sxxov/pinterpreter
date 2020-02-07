const fs = require('fs');
const inquirer = require('inquirer');
const { promisify } = require('util');
const strings = require('../strings');
const paths = require('../paths');

exports.LogUtility = class LogUtility {
	constructor() {
		this.__logFilePath = paths.internal.LOG_FILE;
	}

	addToContext(ctx) {
		ctx.log = this.log;
		ctx.warn = this.warn;
		ctx.error = this.error;
		ctx.ask = this.ask;
		ctx.setLogToConsole = this.setLogToConsole;
		ctx.getLogToConsole = this.getLogToConsole;
	}

	setLogToConsole(toConsole) {
		this.__logToConsole = toConsole;
	}

	getLogToConsole() {
		return this.__logToConsole;
	}

	log(message = '', ctx = this) {
		const self = new LogUtility();

		self.__boiler({
			message,
			logState: strings.general.logStates.LOG,
			printFunction: console.log,
			ctx,
		});
	}

	error(message = '', ctx = this) {
		const self = new LogUtility();

		self.__boiler({
			message,
			logState: strings.general.logStates.ERROR,
			printFunction: console.error,
			ctx,
		});
	}

	warn(message = '', ctx = this) {
		const self = new LogUtility();

		self.__boiler({
			message,
			logState: strings.general.logStates.WARN,
			printFunction: console.warn,
			ctx,
		});
	}

	async ask(message = '', choices = ['OK']) {
		const processedChoices = choices;

		choices.forEach((choice, i) => {
			switch (choice) {
			case '':
				processedChoices[i] = new inquirer.Separator();
				break;
			default:
				processedChoices[i] = choice;
			}
		});

		const question = await inquirer.prompt([{
			type: 'list',
			name: 'answer',
			message,
			choices: processedChoices,
		}]);

		return question.answer;
	}

	async __boiler({
		message = '',
		logState = strings.general.logStates.LOG,
		printFunction = console.log,
		ctx = this,
	}) {
		const logMessage = `${ctx.constructor.name}: ${new Date().toLocaleString()}: ${logState}: ${message}`;

		(new LogUtility()).__appendLogFile(logMessage);
		return ctx.__logToConsole ? printFunction(logMessage) : () => printFunction(logMessage);
	}

	async __appendLogFile(message = '') {
		await promisify(fs.appendFile)(this.__logFilePath, `${message}\r\n`);
	}
};
