const { ClientError } = require('./client.error');
const strings = require('../strings');

exports.NullBrowserError = class NullBrowserError extends ClientError {
	constructor() {
		super({
			message: strings.errors.NULL_BROWSER,
		});
	}
};
