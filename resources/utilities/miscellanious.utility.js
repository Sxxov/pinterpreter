exports.sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

exports.randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

exports.addReplaceAllToStringPrototype = () => {
	if (!String.prototype.replaceAll) {
		// eslint-disable-next-line no-extend-native
		String.prototype.replaceAll = replaceAll;
	}

	function replaceAll(...strings) {
		let processedTarget = this;

		strings.forEach((string) => {
			processedTarget = processedTarget.split(string).join('');
		});

		return processedTarget;
	}
};
