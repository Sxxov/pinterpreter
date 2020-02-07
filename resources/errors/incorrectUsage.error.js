const { ClientError } = require('./client.error');
const strings = require('../strings');

exports.IncorrectUsageError = class IncorrectUsageError extends ClientError {
	constructor({
		message,
	} = {}) {
		super({
			message: `${strings.errors.INCORRECT_USAGE}: ${message}`,
		});
	}
};
