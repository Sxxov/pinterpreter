const { ClientError } = require('./client.error');
const strings = require('../strings');

exports.UnsupportedOSError = class UnsupportedOSError extends ClientError {
	constructor() {
		super({
			message: strings.errors.UNSUPPORTED_OS,
		});
	}
};
