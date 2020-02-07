const { exec } = require('child_process');
const { UnsupportedOSError } = require('../errors');

exports.TasksUtility = class TasksUtility {
	constructor() {
		this.possibleCommands = {
			getTasks: {
				win32: 'tasklist',
				darwin: 'ps -ax',
				linux: 'ps -A',
			},
			killTask: {
				win32: 'taskkill /im',
				darwin: 'pkill',
				linux: 'pkill',
			},
		};
	}

	async kill(task) {
		const ctx = new TasksUtility();
		let taskName;

		if (process.platform === 'win32') {
			taskName = `${task}.exe`;
		} else {
			taskName = task;
		}
		return ctx.__runPlatformCommand(ctx.possibleCommands.killTask, taskName);
	}

	async isRunning(task, {
		tolerance = 0,
	} = {
		tolerance: 0,
	}) {
		const ctx = new TasksUtility();
		const tasks = await ctx.__runPlatformCommand(ctx.possibleCommands.getTasks);

		return tolerance < (tasks.split(task).length - 1);
	}

	async __runPlatformCommand(possibleCommands, ...args) {
		let command = possibleCommands[process.platform] || null;

		if (command === null) {
			throw new UnsupportedOSError();
		}

		command += ` ${args.join(' ')}`;

		return new Promise((resolve) => exec(command, (err, stdout) => {
			resolve(stdout);
		}));
	}
};
