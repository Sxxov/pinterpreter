const __export = (obj) => { Object.keys(obj).forEach((key) => { exports[key] = obj[key]; }); };

__export(require('./core/browserController'));
__export(require('./core/workflowPerformer'));
