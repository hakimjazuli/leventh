// @ts-check

/**
 * @description
 * - helper function for internal typings;
 * - you can also use this `typehelpers` for no-bundlers approach:
 * ```js
 * // @ts-check
 * /**
 *  * @callback onLoad_onUnloadFunction
 *  * @param {HTMLElement} element
 *  * @returns {void}
 *  *[blank]/
 * /**
 *  * @callback onAttrChangedFunction
 *  * @param {Object} param0
 *  * @param {HTMLElement} param0.element
 *  * @param {string} param0.attributeName
 *  * @param {string} param0.newValue
 *  * @param {string} param0.oldValue
 *  * @returns {void}
 *  *[blank]/
 * /**
 *  * @callback onViewFunction
 *  * @param {Object} param0
 *  * @param {HTMLElement} param0.element
 *  * @param {()=>void} param0.unObserve
 *  * @param {()=>void} param0.stopViewCallback
 *  * @returns {void}
 *  *[blank]/
 * /**
 *  * @callback onExitViewFunction
 *  * @param {Object} param0
 *  * @param {HTMLElement} param0.element
 *  * @param {()=>void} param0.unObserve
 *  * @param {()=>void} param0.stopViewCallback
 *  * @param {()=>void} param0.stopExitViewCallback
 *  * @returns {void}
 *  *[blank]/
 * ```
 */
/**
 * @template {'load' | 'unload' | 'attrChanged' | 'view' | 'exitView'} T
 * @param {string} key
 * @param {T} type
 * @returns {T extends 'load' ? onLoad_onUnloadFunction :
 * T extends 'unload' ? onLoad_onUnloadFunction :
 * T extends 'view' ? onViewFunction :
 * T extends 'exitView' ? onExitViewFunction :
 * T extends 'attrChanged' ? onAttrChangedFunction :
 * undefined}
 */
export const getLeventh = (key, type) => {
	if (!window['leventh']) {
		window['leventh'] = {};
	}
	if (!(key in window['leventh'])) {
		window['leventh'][key] = undefined;
	}
	return window['leventh'][key];
};
