// @ts-check

import { getLeventh } from './getLeventh.export.mjs';

/**
 * @description
 * - this function is registrar for leventh reference;
 * - it is just fancy way to register them on `window['leventh']`;
 * - typed for which kind of event you want to register them as;
 * ```js
 * import { setLeventh } from 'leventh';
 * // this approach gave you direct typehint too;
 * setLeventh('load', 'onLoad', (element) => {})
 * setLeventh('unload', 'onUnload', (element) => {})
 * setLeventh('attrChanged', 'onAttrChanged', ({element, attributeName, newValue, oldValue}) => {})
 * setLeventh('view', 'onView', ({element, unObserve, stopViewCallback}) => {})
 * setLeventh('exitView', 'onExitView', ({element, unObserve, stopViewCallback, stopExitViewCallback}) => {})
 * ```
 */
/**
 * @template {'load' | 'unload' | 'attrChanged' | 'view' | 'exitView'} T
 * @param {T} type
 * - type of callback
 * @param {string} key
 * @param {T extends 'load' ? import('./getLeventh.export.mjs').onLoad_onUnloadFunction : T extends 'unload' ? import('./getLeventh.export.mjs').onLoad_onUnloadFunction : T extends 'view' ? import('./getLeventh.export.mjs').onViewFunction : T extends 'exitView' ? import('./getLeventh.export.mjs').onExitViewFunction : T extends 'attrChanged' ? import('./getLeventh.export.mjs').onAttrChangedFunction : undefined} newHandler
 */
export const setLeventh = (type, key, newHandler) => {
	const handler = getLeventh(key, type);
	if (handler) {
		console.error({
			key,
			definedHandler: handler,
			message: `\`leventh\` already definied "${key}"`,
			newHandler,
		});
		return;
	}
	window['leventh'][key] = newHandler;
};
