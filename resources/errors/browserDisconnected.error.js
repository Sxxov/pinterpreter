const { ClientError } = require('./client.error');
const strings = require('../strings');

exports.BrowserDisconnectedError = class BrowserDisconnectedError extends ClientError {
	constructor() {
		super({
			message: strings.errors.BROWSER_DISCONNECTED,
		});
	}
};
