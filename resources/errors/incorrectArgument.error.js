const { ClientError } = require('./client.error');
const strings = require('../strings');

exports.IncorrectArgumentError = class IncorrectArgumentError extends ClientError {
	constructor({
		found = null,
		expected = null,
	} = {}) {
		let processedExpected = expected;

		if (expected instanceof Array) {
			expected.forEach((item, i) => {
				processedExpected[i] = __getConstructorName(item);
			});

			processedExpected = processedExpected.join(', ');
		}

		super({
			message: `${strings.errors.INCORRECT_ARGUMENT}: ${__getConstructorName(found)} != ${__getConstructorName(processedExpected)}`,
		});

		function __getConstructorName(obj = null) {
			return obj === null ? 'null' : obj.constructor.name;
		}
	}
};
