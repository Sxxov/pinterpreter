const { ClientError } = require('./client.error');
const strings = require('../strings');

exports.RottenCookiesError = class RottenCookiesError extends ClientError {
	constructor() {
		super({
			message: strings.errors.ROTTEN_COOKIES,
		});
	}
};
