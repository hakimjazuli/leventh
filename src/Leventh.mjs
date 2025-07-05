// @ts-check

import { callbacks as Callbacks } from './callbacks.mjs';
import { getLeventh } from './getLeventh.export.mjs';
import { qUnique as QUnique } from './qUnique.mjs';

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
 * ```js
 * import { setLeventh } from 'leventh';
 * // this approach gave you direct typehint too;
 * setLeventh('onLoad', (element) => {}, 'load')
 * setLeventh('onUnload', (element) => {}, 'unload')
 * setLeventh('onAttrChanged', ({element, attributeName, newValue, oldValue}) => {}, 'attrChanged')
 * setLeventh('onView', ({element, unObserve, stopViewCallback}) => {}, 'view')
 * setLeventh('onExitView', ({element, unObserve, stopViewCallback, stopExitViewCallback}) => {}, 'exitView')
 * ```
 *>>- by doing this, you can allways uses same function for multiple element, especially with some conditional with it's `attributeName` & `attributeValue`;
 */
export class Leventh {
	/** @type {Leventh} */
	static #instance;

	constructor() {
		if (Leventh.#instance) {
			return Leventh.#instance;
		}

		Leventh.#instance = this;
		const namespace = 'lvn';
		this.#onloadAttr = `${namespace}:load`;
		this.#onUnloadAttr = `${namespace}:unload`;
		this.#onAttrChangedAttr = `${namespace}:attr-changed`;
		this.#onViewAttr = `${namespace}:view`;
		this.#onExitViewAttr = `${namespace}:exit-view`;
		this.#initatorSelector = `[${namespace}\\:load],[${namespace}\\:unload],[${namespace}\\:attr-changed],[${namespace}\\:view],[${namespace}\\:exit-view]`;
		this.#init();
	}
	/**
	 * @type {string}
	 */
	#onloadAttr;
	/**
	 * @type {string}
	 */
	#initatorSelector;
	/**
	 * @type {string}
	 */
	#onUnloadAttr;
	/**
	 * @type {string}
	 */
	#onAttrChangedAttr;
	/**
	 * @type {string}
	 */
	#onViewAttr;
	/**
	 * @type {string}
	 */
	#onExitViewAttr;
	/**
	 * @type {WeakMap<HTMLElement, Callbacks>}
	 */
	#mappedLifecycle = new WeakMap();
	/**
	 * @param {Node} node
	 */
	#scan = (node) => {
		if (!(node instanceof HTMLElement)) {
			return;
		}
		this.#invokeAndStrip(node);
		node.querySelectorAll(this.#initatorSelector).forEach((child) => {
			if (!(child instanceof HTMLElement)) {
				return;
			}
			this.#invokeAndStrip(child);
		});
	};
	/**
	 * @param {Element} element
	 */
	#invokeAndStrip = async (element) => {
		if (!(element instanceof HTMLElement)) {
			return;
		}
		try {
			let unloadScript = element.getAttribute(this.#onUnloadAttr);
			element.removeAttribute(this.#onUnloadAttr);
			let attrChangedScript = element.getAttribute(this.#onAttrChangedAttr);
			element.removeAttribute(this.#onAttrChangedAttr);
			let viewScript = element.getAttribute(this.#onViewAttr);
			element.removeAttribute(this.#onViewAttr);
			let exitViewScript = element.getAttribute(this.#onExitViewAttr);
			element.removeAttribute(this.#onExitViewAttr);
			if (
				(unloadScript || attrChangedScript || viewScript || exitViewScript) &&
				!this.#mappedLifecycle.has(element)
			) {
				const stopExitViewCallback = () => {
					const mapped = this.#mappedLifecycle.get(element);
					if (!mapped) {
						return;
					}
					mapped.xv = undefined;
				};
				const stopViewCallback = () => {
					const mapped = this.#mappedLifecycle.get(element);
					if (!mapped) {
						return;
					}
					mapped.v = undefined;
				};
				const registerXv = () => {
					const ref = this.#mappedLifecycle.get(element);
					if (!ref) {
						return;
					}
					if (!exitViewScript) {
						ref.xv = undefined;
						return;
					}
					const handler = getLeventh(exitViewScript, 'exitView');
					const unObserve = () => this.#unobserveIntersection(element);
					if (handler) {
						ref.xv = () =>
							(ref.xv = () =>
								handler({ element, stopExitViewCallback, stopViewCallback, unObserve }));
						return;
					}
					new Function(
						'unObserve',
						'stopExitViewCallback',
						`stopViewCallback`,
						`${exitViewScript}({element:this,unObserve,stopExitViewCallback,stopViewCallback})`
					).call(element, unObserve, stopExitViewCallback, stopViewCallback);
				};
				let dcHandler = undefined;
				if (unloadScript) {
					const handler = getLeventh(unloadScript, 'unload');
					if (!handler) {
						dcHandler = () => new Function(`${unloadScript}(this)`).call(element);
					} else {
						dcHandler = () => handler(element);
					}
				}
				let acHandler = undefined;
				if (attrChangedScript) {
					const handler = getLeventh(attrChangedScript, 'attrChanged');
					if (handler) {
						acHandler = (attributeName, newValue, oldValue) => {
							handler({ element, attributeName, newValue, oldValue });
						};
					} else {
						acHandler = (attributeName, newValue, oldValue) => {
							new Function(
								'attributeName',
								'newValue',
								'oldValue',
								`${attrChangedScript}({element:this,attributeName,newValue,oldValue})`
							).call(element, attributeName, newValue, oldValue);
						};
					}
				}
				let vHandler = undefined;
				if (viewScript) {
					registerXv();
					const handler = getLeventh(viewScript, 'view');
					if (handler) {
						vHandler = () =>
							handler({
								element,
								stopViewCallback,
								unObserve: () => this.#unobserveIntersection(element),
							});
					} else {
						vHandler = () =>
							new Function(
								'unObserve',
								`stopViewCallback`,
								`${viewScript}({element:this,unObserve,stopViewCallback})`
							).call(
								element,
								() => this.#unobserveIntersection(element),
								() => {
									const mapped = this.#mappedLifecycle.get(element);
									if (!mapped) {
										return;
									}
									mapped.v = undefined;
								}
							);
					}
				}
				this.#mappedLifecycle.set(
					element,
					new Callbacks({
						dc: dcHandler,
						ac: acHandler,
						v: vHandler,
					})
				);
				if (viewScript || exitViewScript) {
					this.#observeIntersection(element);
				}
			}
			const onloadScript = element.getAttribute(this.#onloadAttr);
			element.removeAttribute(this.#onloadAttr);
			if (!onloadScript) {
				return;
			}
			const loadHandler = getLeventh(onloadScript, 'load');
			if (loadHandler) {
				loadHandler(element);
				return;
			}
			new Function(`${onloadScript}(this)`).call(element);
		} catch (error) {
			console.error(`${this.#onloadAttr} error:`, error);
		}
	};
	/**
	 * @param {Node} node
	 */
	#scanDeleted = (node) => {
		if (!(node instanceof HTMLElement)) {
			return;
		}
		this.#unload(node);
		for (const child of node.children) {
			this.#scanDeleted(child);
		}
	};
	/**
	 * @param {HTMLElement} element
	 */
	#unload = async (element) => {
		try {
			const callbacks = this.#mappedLifecycle.get(element);
			if (!callbacks || !callbacks.dc) {
				return;
			}
			this.#mappedLifecycle.delete(element);
			callbacks.dc();
		} catch (error) {
			console.error(`${this.#onUnloadAttr} error:`, error);
		}
	};
	/**
	 * @param {HTMLElement} element
	 * @param {string} attributeName
	 * @param {string} newValue
	 * @param {string} oldValue
	 */
	#attrChanged = (element, attributeName, newValue, oldValue) => {
		if (!(element instanceof HTMLElement)) {
			return;
		}
		try {
			const callbacks = this.#mappedLifecycle.get(element);
			if (!callbacks || !callbacks.ac) {
				return;
			}
			callbacks.ac(attributeName, newValue, oldValue);
		} catch (error) {
			console.error(`${this.#onAttrChangedAttr} error:`, error);
		}
	};
	#interSectionObserver = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				const element = entry.target;
				if (!(element instanceof HTMLElement)) {
					return;
				}
				const registry = this.#mappedLifecycle.get(element);
				if (!registry) {
					continue;
				}
				if (entry.isIntersecting && registry.v) {
					registry.v();
				} else if (!entry.isIntersecting && registry.xv) {
					registry.xv();
				}
			}
		},
		{
			threshold: 0,
		}
	);
	/**
	 * @param {HTMLElement} element
	 * @returns {void}
	 */
	#observeIntersection(element) {
		this.#interSectionObserver.observe(element);
	}
	/**
	 * @param {HTMLElement} element
	 * @returns {void}
	 */
	#unobserveIntersection(element) {
		this.#interSectionObserver.unobserve(element);
	}

	#init() {
		document.querySelectorAll(this.#initatorSelector).forEach((element) => {
			this.#invokeAndStrip(element);
		});
		new MutationObserver((mutations) => {
			QUnique.assign({
				i: mutations,
				c: async () => {
					for (const {
						type,
						addedNodes,
						removedNodes,
						attributeName,
						attributeNamespace,
						oldValue,
						target,
					} of mutations) {
						switch (type) {
							case 'childList':
								if (addedNodes.length) {
									addedNodes.forEach((node) => {
										this.#scan(node);
									});
								}
								if (removedNodes.length) {
									removedNodes.forEach((node) => {
										this.#scanDeleted(node);
									});
								}
								break;
							case 'attributes':
								{
									const element = target;
									if (!(element instanceof HTMLElement)) {
										continue;
									}
									const att = attributeName
										? attributeName
										: attributeNamespace
										? attributeNamespace
										: '';
									this.#attrChanged(element, att, element.getAttribute(att) ?? '', oldValue ?? '');
								}
								break;
						}
					}
				},
			});
		}).observe(document, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeOldValue: true,
		});
	}
}
