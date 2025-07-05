/**
 * @description
 * - `namespaced` attibute to prevent clash with other library you might install, all `attributeNameHandlers` ar previxed with `"lvn:"`;
 * ```html
 * <div
 *		lvn:load="onLoad"
 *		lvn:unload="onUnload"
 *		lvn:attr-changed="onAttrChanged"
 *		lvn:view="onView"
 *		lvn:exit-view="onExitView"
 * ></div>
 * ```
 *- to be referenced by `Leventh`, the variable need to be;
 *>- `global`, you can even declare it on the html `scriptTag` if necessary:
 * ```js
 * // arbitrary const name for semantics examples,
 * // you can name them as you wishes;
 * const onLoad = (element) => {
 * 	// will be triggered when element is loaded to the DOM;
 * };
 * const onUnload = (element) => {
 * 	// will be triggered when element is unloaded from the DOM;
 * };
 * const onAttrChanged = ({element, attributeName, newValue, oldValue}) => {
 * 	// will be triggered when element attributeValue/attributeNamespaceValue/attributeName/attributeNamespace changed;
 * };
 * const onView = ({element, unObserve, stopViewCallback}) => {
 * 	// will be triggered when element crosses `viewPort`;
 * };
 * const onExitView = ({element, unObserve, stopViewCallback, stopExitViewCallback}) => {
 * 	// will be triggered when element exit `viewPort`;
 * };
 * ```
 * >- OR if you don't want to polute global namespace;
 * ```js
 * window['levent'] = {};
 * window['leventh']['onLoad'] = (element) => {};
 * window['leventh']['onUnload'] = (element) => {};
 * window['leventh']['onAttrChanged'] = ({element, attributeName, newValue, oldValue}) => {};
 * window['leventh']['onView'] = ({element, unObserve, stopViewCallback}) => {};
 * window['leventh']['onExitView'] = ({element, unObserve, stopViewCallback, stopExitViewCallback}) => {};
 * ```
 * >- OR with bundler approach [setLeventh](#setleventh):
 * >>- by doing this, you can allways uses same function for multiple element, especially with some conditional with it's `attributeName` & `attributeValue`;
 */
export class Leventh {
    /** @type {Leventh} */
    static "__#2@#instance": Leventh;
    #private;
}
