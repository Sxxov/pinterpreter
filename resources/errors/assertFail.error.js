const { ClientError } = require('./client.error');
const strings = require('../strings');

exports.AssertFailError = class AssertFailError extends ClientError {
	constructor({
		reason = null,
	} = {
		reason: null,
	}) {
		let processedReason;

		if (reason !== null) {
			processedReason = `: ${reason}`;
		} else {
			processedReason = '';
		}
		super({
			message: `${strings.errors.ASSERT_FAIL}${processedReason}`,
		});
	}
};
