const { ClientError } = require('./client.error');
const strings = require('../strings');

exports.NullPagesError = class NullPagesError extends ClientError {
	constructor() {
		super({
			message: strings.errors.NULL_PAGES,
		});
	}
};
