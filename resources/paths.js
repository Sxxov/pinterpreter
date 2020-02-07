const os = require('os');
const pathTool = require('path');
const fs = require('fs');

const paths = {
	chrome: {
		EXECUTABLE: {
			win32: [
				'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
				'C:/Program Files/Google/Chrome/Application/chrome.exe',
				`${os.homedir()}/AppData/Roaming/Google/Chrome/Application/chrome.exe`,
			],
			darwin: [
				'TODO',
			],
			linux: [
				'TODO',
			],
		},
		USER_DATA: {
			win32: [
				`${os.homedir()}/AppData/Local/Google/Chrome/User Data`,
			],
			darwin: [
				`${os.homedir()}/Library/Application/Support/Google/Chrome`,
			],
			linux: [
				`${os.homedir()}/.config/google-chrome`,
			],
		},
	},
	internal: {
		EXTENSIONS: './raw/extensions',
		PRELOAD: './raw/preload.js',
		COOKIES: './.cookies',
		LOG_FILE: './.log',
	},
};

// exports the paths after they're 'compiled'
// from the outside, the result should be treated as a constant
module.exports = __compilePaths();

function __compilePaths() {
	const unresolvedPathsObj = paths;
	const resolvedPathsObj = paths;
	let tree = '';
	let frozenTree = null;

	// using es6 function declaration as it accesses outer variables,
	// thought it might look more logical like this
	const iterateCallback = (key, value) => {
		if (value instanceof Object) {
			if (key === 'win32'
				|| key === 'darwin'
				|| key === 'linux') {
				if (key === process.platform) {
					// store the current tree so it'll be used later instead
					frozenTree = tree;
				} else {
					// return if it's not the current os's path
					return;
				}
			}
			// adds the level of iteration for object into 'tree'
			// eg. ['chrome']['executable']['win32']
			tree += `['${key}']`;

			// uses recursion to go deeper into the object
			iterate(value, iterateCallback);

			// removes the last level of iteration after one whole object is iterated through
			tree = tree.split('[').slice(0, -1).join('[');
			return;
		}
		// turn the slashes to correct directions for current os
		const resolvedPath = pathTool.resolve(value);

		// don't assign the value if the path doesn't exist
		if (fs.existsSync(resolvedPath) === false) {
			return;
		}

		// if ti's a value, then use it's "key" string as the notation
		// because it's javascript,
		// ['0'], works (for array indexes)
		// ['bruh'], works (for object keys)
		// ['bruh']['0'], works (for both)
		const index = `['${key}']`;
		const computedPropertyName = frozenTree || `${tree}${index}`;

		if (computedPropertyName === frozenTree) {
			// clear any frozen trees so it won't be used instead of the tree next time
			frozenTree = null;
		}

		// assigns the object's items at the current level
		// eg. resolvedPathsObj['chrome']['executable']['windows'] = 'foo'
		// eslint-disable-next-line no-eval
		eval(`resolvedPathsObj${computedPropertyName} = resolvedPath`);
	};

	iterate(unresolvedPathsObj, iterateCallback);

	return resolvedPathsObj;

	function iterate(obj, callback = () => {}) {
		Object.keys(obj).forEach((key, i) => {
			callback(key, obj[key], i);
		});
	}
}
