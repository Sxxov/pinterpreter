/* eslint-disable no-extend-native */
const { IncorrectArgumentError } = require('../errors');

exports.ForUtility = class ForUtility {
	addToArrayPrototype() {
		const ctx = new ForUtility();

		if (!Array.prototype.__forUtilitySingletonExecuted) {
			Array.prototype.__forUtilitySingletonExecuted = true;
			Array.prototype.forOf = ctx.__forOf;
			Array.prototype.forAwait = ctx.__forAwait;
			Array.prototype.all = ctx.__all;
			Array.prototype.some = ctx.__some;
			Array.prototype.forReturn = ctx.__forReturn;
		}
	}

	async __forAwait(callback, ctx = null) {
		const workingArray = this;
		const self = new ForUtility();

		self.__throwIfArgIsNotArray(workingArray);
		self.__throwIfArgIsNotFunction(callback);

		for (let i = 0, l = workingArray.length; i < l; ++i) {
			await callback.call(ctx || this, workingArray[i], i);
		}
	}

	__forOf(callback, ctx = null) {
		const workingArray = this;
		const self = new ForUtility();

		self.__throwIfArgIsNotArray(workingArray);
		self.__throwIfArgIsNotFunction(callback);

		for (let i = 0, l = workingArray.length; i < l; ++i) {
			callback.call(ctx || this, workingArray[i], i);
		}
	}

	async __forReturn(callback, ctx = null) {
		const workingArray = this;
		const returnValuesPromises = [];
		const self = new ForUtility();

		self.__throwIfArgIsNotArray(workingArray);
		self.__throwIfArgIsNotFunction(callback);

		for (let i = 0, l = workingArray.length; i < l; ++i) {
			returnValuesPromises.push(callback.call(ctx || this, workingArray[i], i));
		}

		const returnValues = await Promise.all(returnValuesPromises);
		for (let i = 0, l = returnValues.length; i < l; ++i) {
			const returnValue = returnValues[i];
			if (returnValue === undefined) {
				returnValues.splice(returnValues.indexOf(returnValue), 1);
			}
		}

		return returnValues;
	}

	__all(callback, ctx = null) {
		const workingArray = this;
		const returnValues = [];
		const self = new ForUtility();

		self.__throwIfArgIsNotArray(workingArray);
		self.__throwIfArgIsNotFunction(callback);

		for (let i = 0, l = workingArray.length; i < l; ++i) {
			if (callback.call(ctx || this, workingArray[i], i)) {
				returnValues.push(workingArray[i]);
			}
		}

		return returnValues;
	}

	__some(callback, ctx = null) {
		const workingArray = this;
		const self = new ForUtility();

		self.__throwIfArgIsNotArray(workingArray);
		self.__throwIfArgIsNotFunction(callback);

		for (let i = 0, l = workingArray.length; i < l; ++i) {
			if (callback.call(ctx || this, workingArray[i], i)) {
				return workingArray[i];
			}
		}

		return null;
	}

	__throwIfArgIsNotArray(arg) {
		if (!(arg instanceof Array)) {
			throw new IncorrectArgumentError({
				found: arg,
				expected: Array,
			});
		}
	}

	__throwIfArgIsNotFunction(arg) {
		if (!(arg instanceof Function)) {
			throw new IncorrectArgumentError({
				found: arg,
				expected: Function,
			});
		}
	}
};
