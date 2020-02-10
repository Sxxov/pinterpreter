
# API
* [API formatting](#format)
* [Core](#core)
	* [`class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/class): [Pinterpreter](#pinterpreter)`()`
		*  [`class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/class): [BrowserController](#browsercontroller)`()`
		* [`class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/class): [WorkflowPerformer](#workflowperformer)`()`
* [Workflow](#workflow)
	* [Work](#work)
		* [Actions](#workactions)
		* [Options](#workoptions)

## <a name="format"></a>API formatting
**`...` <`...`> (bold)**

* a required parameter.

`...` <`...`> (non bold)

* an optional parameter.

`(...)`

* a method call with parameters inside.

<`...`>

* an instance of such type.

<`...` = `...`>

* an instance of such type with a default value.

<`...` || `...`>

* a possible instance of one of such types.


## <a name="core"></a>Core

### Overview
[`Pinterpreter`](#pinterpreter): wrapper class that communicates with Puppeteer through a [`Workflow`](#workflow), contains the following:
* [`BrowserController`](#browsercontroller): contains one instance of `(Puppeteer) `[`Browser`](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#class-browser) and `(Puppeteer)`[`Page`](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#class-page).
* [`WorkflowPerformer`](#workflowperformer): uses one instance of [`BrowserController`](#browsercontroller).

### <a name="pinterpreter"></a> [`class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/class): Pinterpreter`()`
Pinterpreter is just a wrapper class to contain the other core classes.
* returns: `{ `[`BrowserController`](#browsercontroller)`, `[`WorkflowPerformer`](#workflowperformer)` }`
##### Example usage:
```js
const pinterpreter = require('pinterpreter');
```
> You may also use destructuring to bypass the assigning of the 'pinterpreter' variable:
> ```js
> const {
>	BrowserController,
>	WorkflowPerformer,
>} = require('pinterpreter');
> ```

> Note: There are no methods in this class.
### <a name="browsercontroller"></a> [`class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/class): BrowserController`()`
The class that manages interaction with Puppeteer, and subsequently the browser.
* returns: [`self`](#browsercontroller)
##### Example usage:
```js
const { BrowserController } = require('pinterpreter');

const browserController = new BrowserController();
const browser = await browserController.launch();
```
#### browserController.launch`(options)` 
Launches the browser using puppeteer.
* `options` <[`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)> 
	* `saveCookies` <[`boolean`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) = `true`> Whether to save cookies or not using `CookieMonsterUtility`.
	* `tryForUserBrowser` <[`boolean`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) = `true`> Whether to try to use the user's browser.
	* `forceKillChrome` <[`boolean`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) = `false`> Whether to use [`inquirer`]([https://github.com/SBoudrias/Inquirer.js](https://github.com/SBoudrias/Inquirer.js)) to prompt to close the user's browser. Only applicable if `tryForUserBrowser` is set to `true`.
	* `executablePath` <[`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) = [`null`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null)> The custom path to a chrome executable. If [`null`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null) or an invalid path is passed, it will use the internal browser instead.
	* `userDataDir` <[`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) = [`null`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null)> The custom path to a chrome's 'userData' directory. If [`null`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null) or an invalid path is passed, it will use the internal browser instead.
	* `headless` <[`boolean`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) = `false`> Whether to launch in headless mode. Affects the loading of [extensions](#extensions)
	* `[?...others]` <any = [`null`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null)> Any other [puppeteer launch option](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions) will be reflected onto puppeteer's launch method too.

* returns:  <[`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[`Browser`](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#class-browser)>>

#### browserController.$`(selector, functionToEval)`
Returns the element or the return value of the function evaluated in the browser context.
* **`selector` <[`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)>** The [selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors "selector") to query the page
* `functionToEval` <[`Function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) = [`null`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null)> The function to be evaluated with the page context.

* returns: <[`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<?[`ElementHandle`](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#class-elementhandle "ElementHandle") || any>> 

#### browserController.$$`(selector, functionToEval)`
Returns the element or the return value of the function evaluated in the browser context.
* **`selector` <[`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)>** The [selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors "selector") to query the page
* `functionToEval` <[`Function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) = [`null`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null)> The function to be evaluated with the page context.

* returns: <[`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[`Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[`ElementHandle`](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#class-elementhandle "ElementHandle")> || any>> 

#### browserController.getBrowser`()`
Returns the created Browser object.
* returns: <[`Browser`](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#class-browser)>

#### browserController.getPages`()`
Returns all of the pages that are cached until now.
* returns: <[`Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[`Page`](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#class-page)>> 

#### browserController.getWorkingPage`()`
Returns the page that was created by Puppeteer on startup.
* returns: <[`Page`](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#class-page)> 

#### browserController.end`()`

* returns: <[`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[`undefined`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)>>

### <a name="workflowperformer"></a> [`class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/class): WorkflowPerformer`()`
The class that evaluates a [`Workflow`](#workflow)
* returns: [`self`](#workflowperformer)

##### Example usage:
```js
const { EXAMPLE_WORKFLOW } = require('path/to/workflow');
const {
	BrowserController,
	WorkflowPerformer,
} = require('pinterpreter');

const browserController = new BrowserController();
const browser = await browserController.launch();

const workflowPerformer = new WorkflowPerformer();
await workflowPerformer.setBrowserController(browserController);

await workflowPerformer.perform(EXAMPLE_WORKFLOW);

await browserController.end();
```

#### workflowPerformer.setBrowserController`(browserController)`
Assigns a [`BrowserController`](#browsercontroller) instance to be used by [`WorkflowPerformer`](#workflowperformer)
* returns: <[`undefined`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)>

#### workflowPerformer.perform`(workflow, ctx)`
Evaluate a [`Workflow`](#workflow)
* **`workflow` <[`Workflow`](#workflow)>** The pseudo JSON [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) to evaluate.
* `ctx` <[`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)> The 'context' object to be reflected in to [`WorkflowPerformer`](#workflowperformer)'s 'this' object for the workflow to be evaluated in.
* returns: <[`undefined`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)>

## <a name="workflow"></a> Workflow

### <a name="howdoworkflowswork"></a>How does it work?
1) Perform the next [`Work`](#work), if found.

2) Perform the first [`Action`](#workactions), if its [`if`](#workoptions) condition is met, and it's found.

3) If the result of last [`Action`](#workactions) is `true`, perform the next [`Action`](#workactions), if it's an [`Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) of [`Action`](#workactions)s and it's found.

4) Goto 1.

> Note: A chain of `action`s act like it is linked up by a 'stricter' && operator, only a true value before it can enable it to continue.

### Overview
* [`Workflow`](#workflow): a wrapper that contains multiple [`Work`](#work) objects that are evaluated sequentially by [`WorkflowPerformer`](#workflowperformer).
	* [`Work`](#work): contains multiple attributes that are evaluated to puppeteer functions.
		* [`action`](#workactions): a command to be interpreted.
		* [`selector`](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors "selector"): a css selector to be referenced for the command.
		* [`options`](#workoptions): multiple options to be referenced for the command.

##### Example usage:
```js
exports.EXAMPLE_WORKFLOW = [
// Work Object, [0]
{
	action:  'assertThrow',
	selector:  null,
	options: {
		customAssertCondition: (ctx) => ctx.credentials !== null,
		},
	},
},
// Work Object, [1]
{
	action:  'href',
	selector:  null,
	options: {
		url:  'https://2204355.com',
		if: (ctx) => ctx.foo === 'bar',
		anchor: 'chicken',
	},
},
// ...
];
```
### Types
#### Workflow <[`Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)>
* **`work` <[`Work`](#work)>** 

#### <a name="work"></a>Work <[`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)> 
* **`action` <[`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) || [`Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)>** Defines what action or method [`WorkflowPerformer`](#workflowperformer) will execute.
* **`selector` <[`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) || [`null`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null)>** Defines the selector of which the action will act upon.
* **`options` <[`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>** Defines the custom parameters passed to the handler of the `action` defined currently.

### <a name="workactions"></a>List of actions (and their usage within a [`Work`](#work) object)
#### `href`
Redirects the browser to another location.
* **`selector` <[`null`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null)>**
* **`options` <[`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>**
	* **`url` <[`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)>**
	* [`...`](#workoptions)

#### `click`
Clicks on the first element selected from the selector.
* **`selector` <[`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)>**
* **`options` <[`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>**
	* [`...`](#workoptions)

#### `type`
Types out a string into the first element selected from the selector.
* **`selector` <[`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)>**
* **`options` <[`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>**
	* **`string` <[`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)>**
	* [`...`](#workoptions)

#### `assert`
Waits for a [`selector`](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors "selector") or the execution of `customAssertCondition` and returns a [`boolean`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) on the success of the condition.
* **`selector` <[`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) || [`null`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null)>**
* **`options` <[`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>**
	* `customAssertCondition` <[`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)>
	* [`...`](#workoptions)
> Note: `assert` is very useful for constructing chains of actions. It can act as the inline if statement and decide if the next action is needed to be performed.

#### `assertInvert`
Waits for a [`selector`](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors "selector") or the execution of `customAssertCondition` and returns an inverted [`boolean`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) on the success of the condition.
* **`selector` <[`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) || [`null`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null)>**
* **`options` <[`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>**
	* `customAssertCondition` <[`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)>
	* [`...`](#workoptions)

#### `assertThrow`
Waits for a [`selector`](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors "selector") or the execution of `customAssertCondition` and throw `assertFailError` if the returned [`boolean`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) is false.
* **`selector` <[`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) || [`null`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null)>**
* **`options` <[`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>**
	* `customAssertCondition` <[`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)>
	* [`...`](#workoptions)

#### `loop`
Loops through an embedded [`Workflow`](#workflow) until the `until` function returns true.
* **`selector` <[`null`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null)>**
* **`options` <[`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>**
	* **`until` <[`Function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)> `(ctx)`**
	* **`workflow` <[`Workflow`](#workflow)>**
	* [`...`](#workoptions)
> Note: Access `WorkflowPerformer`'s context through the first argument of the `until` function, and add to it through the `ctx` argument in the `workflowPerformer.perform()` method.

#### `skip`
Skips to the specified `anchor`
* **`selector` <[`null`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null)>**
* **`options` <[`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>**
	* **`skipToAnchor` <[`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)>**
	* [`...`](#workoptions)

> Note: Skip is best used with a chain of actions, such that it will act like an if statement.
> Example: `[ 'assert', 'skip' ]`

#### sleep
Waits for the specified amount of time
* **`selector` <[`null`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null)>**
* **`options` <[`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>**
	* **`ms` <[`number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)>**
	* [`...`](#workoptions)

### <a name="workoptions"></a> List of non action specific options
Universal options that can be used in every [`Work`](#work) Object
* `anchor` <[`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)> The anchor referenced by the `skip` action
* `if` <[`Function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)> `(ctx)` An if statement for the current [`Work`](#work) object. If it returns false, the action will not be performed.
