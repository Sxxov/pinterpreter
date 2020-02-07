const strings = require('../strings');
const { LogUtility } = require('../utilities/log.utility');

exports.ClientError = class ClientError extends Error {
	constructor({
		message = strings.errors.NO_MESSAGE_PROVIDED,
	} = {}) {
		super(message);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);

		(new LogUtility()).error(message, this);
	}
};
