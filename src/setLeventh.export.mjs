// @ts-check

import { getLeventh } from './getLeventh.export.mjs';

/**
 * @description
 * - this function is registrar for leventh reference;
 * - it is just fancy way to register them on `window['leventh']`;
 * - typed for which kind of event you want to register them as;
 */
/**
 * @template {'load' | 'unload' | 'attrChanged' | 'view' | 'exitView'} T
 * @param {string} key
 * - type of callback
 * @param {T extends 'load' ? import('./getLeventh.export.mjs').onLoad_onUnloadFunction : T extends 'unload' ? import('./getLeventh.export.mjs').onLoad_onUnloadFunction : T extends 'view' ? import('./getLeventh.export.mjs').onViewFunction : T extends 'exitView' ? import('./getLeventh.export.mjs').onExitViewFunction : T extends 'attrChanged' ? import('./getLeventh.export.mjs').onAttrChangedFunction : undefined} newHandler
 * @param {T} type
 */
export const setLeventh = (key, newHandler, type) => {
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
