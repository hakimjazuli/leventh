// @ts-check
/**
 * @callback onLoad_onUnloadFunction
 * @param {HTMLElement} element
 * @returns {void}
 */
/**
 * @callback onAttrChangedFunction
 * @param {Object} param0
 * @param {HTMLElement} param0.element
 * @param {string} param0.attributeName
 * @param {string} param0.newValue
 * @param {string} param0.oldValue
 * @returns {void}
 */
/**
 * @callback onViewFunction
 * @param {Object} param0
 * @param {HTMLElement} param0.element
 * @param {()=>void} param0.unObserve
 * @param {()=>void} param0.stopViewCallback
 * @returns {void}
 */
/**
 * @callback onExitViewFunction
 * @param {Object} param0
 * @param {HTMLElement} param0.element
 * @param {()=>void} param0.unObserve
 * @param {()=>void} param0.stopExitViewCallback
 * @param {()=>void} param0.stopViewCallback
 * @returns {void}
 */

/**
 * @type {onLoad_onUnloadFunction}
 */
const alpineFor = (element) => {
	const nameFor = 'x-for';
	const nameKey = 'x-bind:key';
	const forValue = element.getAttribute(nameFor);
	const xkey = element.getAttribute(nameKey);
	element.removeAttribute(nameFor);
	element.removeAttribute(nameKey);
	const templateElement = document.createElement('template');
	if (forValue) {
		templateElement.setAttribute(nameFor, forValue);
	}
	if (xkey) {
		templateElement.setAttribute(nameKey, xkey);
	}
	templateElement.innerHTML = element.outerHTML;
	element.replaceWith(templateElement);
};

/**
 * @type {onLoad_onUnloadFunction}
 */
const alpineIf = (element) => {
	const nameIf = 'x-if';
	const ifValue = element.getAttribute(nameIf);
	element.removeAttribute(nameIf);
	const templateElement = document.createElement('template');
	if (ifValue) {
		templateElement.setAttribute(nameIf, ifValue);
	}
	templateElement.innerHTML = element.innerHTML;
	element.replaceWith(templateElement);
};
