## leventhJS
- is the simplest `elementLifecycle` library you might find;
- the only abstraction `Leventh` provided is for common `elementLifecycle` that are common on `native` `webComponent`;
>- `connectedCallback` -> `lvn:load`;
>- `disconnectedCallback` -> `lvn:unload`;
>- `attributeChangedcallback` -> `lvn:attr-chaged`;
>- `crossingViewPort` -> `lvn:view`;
>- `exittingViewPort` -> `lvn:exit-view`;
- the core point is simplicity of piece of 🍰 without adding too much abstraction;
>- high level abtraction such as ajax request (eg. htmx functionalities) are to be offloaded to other library;

## how to use
- download the package from `github` or `npm` for the `dist/leventh.mjs` or `dist/leventh.min.mjs`;
- load the script on your html as a module;
```html
<script type="module" src="/path/to/your/downloaded/leventh.min.mjs"></script>
```
- check [Leventh doc](#leventh);

## example
- if your stack looks like this:
>- `alpineJS`: heavy uses of template tags;
>- `bootstrap studio`: have no full support for template tags;
- we provide example like these two:
>- `./dist/alpineTemplateTag.js` for generating `x-for` and `x-if` patten;
>- `./dist/alpineCloak.css` automatically mimic cloaking functionality when either function is called;
```html
<ul x-data="{ colors: [
    { id: 1, label: 'Red' },
    { id: 2, label: 'Orange' },
    { id: 3, label: 'Yellow' },
]}">
      <li lvn:load="alpineFor" x-for="color in colors" x-bind:key="color.id" x-text="color.label"></li>
</ul>
<!-- will generate the html like this -->
<ul x-data="{ colors: [
	{ id: 1, label: 'Red' },
	{ id: 2, label: 'Orange' },
	{ id: 3, label: 'Yellow' },
	]}">
	<template x-for="color in colors" x-bind:key="color.id">
	<li x-text="color.label"></li>
	</template>
	</ul>
<!-- or -->
 <div lvn:load="alpineIf" x-if="open">
    <div>Contents...</div>
</div>
<!-- will generate the html like this -->
<template x-if="open">
	 <div>Contents...</div>
</template>

```

## helpers
- [getLeventh](#getleventh)
- [Leventh](#leventh)
- [setLeventh](#setleventh)
<h2 id="getleventh">getLeventh</h2>

- helper function for internal typings;- you can also use this `typehelpers` for no-bundlers approach:```js// @ts-check/** * @callback onLoad_onUnloadFunction * @param {HTMLElement} element * @returns {void} *//** * @callback onAttrChangedFunction * @param {Object} param0 * @param {HTMLElement} param0.element * @param {string} param0.attributeName * @param {string} param0.newValue * @param {string} param0.oldValue * @returns {void} *//** * @callback onViewFunction * @param {Object} param0 * @param {HTMLElement} param0.element * @param {()=>void} param0.unObserve * @param {()=>void} param0.stopViewCallback * @returns {void} *//** * @callback onExitViewFunction * @param {Object} param0 * @param {HTMLElement} param0.element * @param {()=>void} param0.unObserve * @param {()=>void} param0.stopViewCallback * @param {()=>void} param0.stopExitViewCallback * @returns {void} */```

*) <sub>[go to exported list](#helpers)</sub>

<h2 id="leventh">Leventh</h2>

- `namespaced` attibute to prevent clash with other library you might install, all `attributeNameHandlers` ar previxed with `"lvn:"`;```html<div	lvn:load="onLoad"	lvn:unload="onUnload"	lvn:attr-changed="onAttrChanged"	lvn:view="onView"	lvn:exit-view="onExitView"></div>```- to be referenced by `Leventh`, the variable need to be;>- `global`, you can even declare it on the html `scriptTag` if necessary:```js// arbitrary const name for semantics examples,// you can name them as you wishes;const onLoad = (element) => {	// will be triggered when element is loaded to the DOM;};const onUnload = (element) => {	// will be triggered when element is unloaded from the DOM;};const onAttrChanged = ({element, attributeName, newValue, oldValue}) => {	// will be triggered when element attributeValue/attributeNamespaceValue/attributeName/attributeNamespace changed;};const onView = ({element, unObserve, stopViewCallback}) => {	// will be triggered when element crosses `viewPort`;};const onExitView = ({element, unObserve, stopViewCallback, stopExitViewCallback}) => {	// will be triggered when element exit `viewPort`;};```>- OR if you don't want to polute global namespace;```jswindow['levent'] = {};window['leventh']['onLoad'] = (element) => {};window['leventh']['onUnload'] = (element) => {};window['leventh']['onAttrChanged'] = ({element, attributeName, newValue, oldValue}) => {};window['leventh']['onView'] = ({element, unObserve, stopViewCallback}) => {};window['leventh']['onExitView'] = ({element, unObserve, stopViewCallback, stopExitViewCallback}) => {};```>- OR with bundler approach [setLeventh](#setleventh):>>- by doing this, you can allways uses same function for multiple element, especially with some conditional with it's `attributeName` & `attributeValue`;

*) <sub>[go to exported list](#helpers)</sub>

<h2 id="setleventh">setLeventh</h2>

- this function is registrar for leventh reference;- it is just fancy way to register them on `window['leventh']`;- typed for which kind of event you want to register them as;```jsimport { setLeventh } from 'leventh';// this approach gave you direct typehint too;setLeventh('load', 'onLoad', (element) => {})setLeventh('unload', 'onUnload', (element) => {})setLeventh('attrChanged', 'onAttrChanged', ({element, attributeName, newValue, oldValue}) => {})setLeventh('view', 'onView', ({element, unObserve, stopViewCallback}) => {})setLeventh('exitView', 'onExitView', ({element, unObserve, stopViewCallback, stopExitViewCallback}) => {})```

*) <sub>[go to exported list](#helpers)</sub>
