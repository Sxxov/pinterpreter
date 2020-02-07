const __export = (obj) => { Object.keys(obj).forEach((key) => { exports[key] = obj[key]; }); };

__export(require('./errors/client.error'));
__export(require('./errors/incorrectArgument.error'));
__export(require('./errors/unsupportedOS.error'));
__export(require('./errors/nullBrowser.error'));
__export(require('./errors/nullPages.error'));
__export(require('./errors/incorrectUsage.error'));
__export(require('./errors/rottenCookies.error'));
__export(require('./errors/assertFail.error'));
__export(require('./errors/unknownWorkFunction.error'));
__export(require('./errors/browserDisconnected.error'));
