const { ClientError } = require('./client.error');
const strings = require('../strings');

exports.UnknownWorkFunctionError = class UnknownWorkFunctionError extends ClientError {
	constructor() {
		super({
			message: strings.errors.UNKNOWN_WORK_FUNCTION,
		});
	}
};
