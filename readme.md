

# Pinterpreter

### What is this?
As the name implies, an interpreter for running puppeteer functions. Instead of writing any code, this takes a "workflow", in pseudo-JSON.

### Why was this created?
Puppeteer out of the box requires some other pieces to work efficiently, those other pieces often includes a lot of boiler code or extra libraries that add heft to a project. Pinterpreter aims to be the middle man that consolidates all of them and make puppeteer dead simple to take advantage of.

### What does this add?
* The usage of package-able "workflows" to replace writing code.
* Simple headless detection avoidance.
* Cookies saving and loading from '.cookies' file.
* The ability to use the user's browser instead of the internal one (for easier authentication etc).

## <a name="install"></a>Installation
You'll need "npm" for this:
```batch
npm i instagram-private-api
```

## <a name="usage"></a>Usage
1) Import "Pinterpreter":
```js
const pinterpreter = require('pinterpreter');
```
2) Import your [workflow](https://github.com/sxxov/pinterpreter/blob/master/docs/api.md#workflow)(s):
```js
const { EXAMPLE_WORKFLOW } = require('./path/to/workflow/');
```
3) Launch the browser:

```js
const browserController = new pinterpreter.BrowserController();

const browser = await browserController.launch({
	foo: bar,
});
```
> Note: The browser will run in headless mode by default, so it's normal if you don't see anything happening.

4) Run!
```js
const workflowPerformer = new pinterpreter.WorkflowPerformer();

await workflowPerformer.setBrowserController(browserController);
await workflowPerformer.perform(EXAMPLE_WORKFLOW, {
	foo: bar,
});

```

5) Finally, end it:
```js
await browserController.end();
```
## <a name="more"></a>More usages
Refer to the [API](https://github.com/sxxov/pinterpreter/blob/master/docs/api.md) docs for more information, including how to set up your own workflows and other ways you can launch your browser.



