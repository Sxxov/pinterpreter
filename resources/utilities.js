const __export = (obj) => { Object.keys(obj).forEach((key) => { exports[key] = obj[key]; }); };

__export(require('./utilities/for.utility'));
__export(require('./utilities/log.utility'));
__export(require('./utilities/tasks.utility'));
__export(require('./utilities/miscellanious.utility'));
__export(require('./utilities/cookieMonster.utility'));
