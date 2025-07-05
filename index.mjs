// @ts-check
/**
 * generated using:
 * @see {@link https://www.npmjs.com/package/@html_first/js_lib_template | @html_first/js_lib_template}
 * @copyright
 * made and distributed under MIT licencse;
 * @description
 * ## leventhJS
 * - is the simplest `elementLifecycle` library you might find;
 * - the only abstraction `Leventh` provided is for common `elementLifecycle` that are common on `native` `webComponent`;
 * >- `connectedCallback` -> `lvn:load`;
 * >- `disconnectedCallback` -> `lvn:unload`;
 * >- `attributeChangedcallback` -> `lvn:attr-chaged`;
 * >- `crossingViewPort` -> `lvn:view`;
 * >- `exittingViewPort` -> `lvn:exit-view`;
 * - the core point is simplicity of piece of 🍰 without adding too much abstraction;
 * >- high level abtraction such as ajax request (eg. htmx functionalities) are to be offloaded to other library;
 * 
 * ## how to use
 * - download the package from `github` or `npm` for the `dist/leventh.mjs` or `dist/leventh.min.mjs`;
 * - load the script on your html as a module;
 * ```html
 * <script type="module" src="/path/to/your/downloaded/leventh.min.mjs"></script>
 * ```
 * - check [Leventh doc](#leventh);
 * 
 * ## example
 * - if your stack looks like this:
 * >- `alpineJS`: heavy uses of template tags;
 * >- `bootstrap studio`: have no full support for template tags;
 * - we provide example like these two:
 * >- `./dist/alpineTemplateTag.js` for generating `x-for` and `x-if` patten;
 * >- `./dist/alpineCloak.css` automatically mimic cloaking functionality when either function is called;
 * ```html
 * <ul x-data="{ colors: [
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

 * ```
 * 
 */
export { getLeventh } from './src/getLeventh.export.mjs';
export { Leventh } from './src/Leventh.mjs';
export { setLeventh } from './src/setLeventh.export.mjs';