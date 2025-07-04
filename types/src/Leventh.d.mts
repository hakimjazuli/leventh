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
 *- the variable need to be global, to be referenced by `Leventh`;
 *- you can even declare it on the html `scriptTag` if necessary;
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
 * 	// will be triggered when element crosses `viewPort`;
 * };
 * ```
 * - by doing this, you can allways uses same function for multiple element, especially with some conditional with it's `attributeName` & `attributeValue`;
 * ### `typehelpers`
 * ```js
 * // @ts-check
 * /**
 *  * @callback onLoad_onUnloadFunction
 *  * @param {HTMLElement} element
 *  * @returns {void}
 *  *[blank]/
 * /**
 *  * @callback attrChangedFunction
 *  * @param {Object} param0
 *  * @param {HTMLElement} param0.element
 *  * @param {string} param0.attributeName
 *  * @param {string} param0.newValue
 *  * @param {string} param0.oldValue
 *  * @returns {void}
 *  *[blank]/
 * /**
 *  * @callback viewFunction
 *  * @param {Object} param0
 *  * @param {HTMLElement} param0.element
 *  * @param {()=>void} param0.unObserve
 *  * @param {()=>void} param0.stopViewCallback
 *  * @returns {void}
 *  *[blank]/
 * /**
 *  * @callback exitViewFunction
 *  * @param {Object} param0
 *  * @param {HTMLElement} param0.element
 *  * @param {()=>void} param0.unObserve
 *  * @param {()=>void} param0.stopViewCallback
 *  * @param {()=>void} param0.stopExitViewCallback
 *  * @returns {void}
 *  *[blank]/
 * ```
 */
export class Leventh {
    /** @type {Leventh} */
    static "__#4661@#instance": Leventh;
    #private;
}
/**
 * *
 */
export type onLoad_onUnloadFunction = (element: HTMLElement) => void;
/**
 * *
 */
export type attrChangedFunction = (param0: {
    element: HTMLElement;
    attributeName: string;
    newValue: string;
    oldValue: string;
}) => void;
/**
 * *
 */
export type viewFunction = (param0: {
    element: HTMLElement;
    unObserve: () => void;
    stopViewCallback: () => void;
}) => void;
/**
 * *
 */
export type exitViewFunction = (param0: {
    element: HTMLElement;
    unObserve: () => void;
    stopViewCallback: () => void;
    stopExitViewCallback: () => void;
}) => void;
