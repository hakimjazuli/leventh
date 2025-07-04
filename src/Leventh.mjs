// @ts-check

import { callbacks as Callbacks } from './callbacks.mjs';
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
 * const onExitView = ({element, unObserve, stopExitViewCallback}) => {
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
 *  * @param {()=>void} param0.stopExitViewCallback
 *  * @param {()=>void} param0.stopViewCallback
 *  * @returns {void}
 *  *[blank]/
 * ```
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
			const unloadScript = element.getAttribute(this.#onUnloadAttr);
			element.removeAttribute(this.#onUnloadAttr);
			const attrChangedScript = element.getAttribute(this.#onAttrChangedAttr);
			element.removeAttribute(this.#onAttrChangedAttr);
			const viewScript = element.getAttribute(this.#onViewAttr);
			element.removeAttribute(this.#onViewAttr);
			const exitViewScript = element.getAttribute(this.#onExitViewAttr);
			element.removeAttribute(this.#onExitViewAttr);
			if (
				(unloadScript || attrChangedScript || viewScript || exitViewScript) &&
				!this.#mappedLifecycle.has(element)
			) {
				const registerXv = () => {
					const ref = this.#mappedLifecycle.get(element);
					if (!ref) {
						return;
					}
					ref.xv = exitViewScript
						? new Function(
								'unObserve',
								'stopExitViewCallback',
								`stopViewCallback`,
								`${exitViewScript}({element:this,unObserve,stopExitViewCallback,stopViewCallback})`
						  ).bind(
								element,
								() => this.#unobserveIntersection(element),
								() => {
									const mapped = this.#mappedLifecycle.get(element);
									if (!mapped) {
										return;
									}
									mapped.xv = undefined;
									mapped.v = undefined;
								}
						  )
						: undefined;
				};
				this.#mappedLifecycle.set(
					element,
					new Callbacks({
						dc: unloadScript
							? () => {
									new Function(`${unloadScript}(this)`).bind(element);
							  }
							: undefined,
						ac: attrChangedScript
							? /**
							   * @param {string} attributeName
							   * @param {string} newValue
							   * @param {string} oldValue
							   */
							  (attributeName, newValue, oldValue) =>
									new Function(
										'attributeName',
										'newValue',
										'oldValue',
										`${attrChangedScript}({element:this,attributeName,newValue,oldValue})`
									).call(element, attributeName, newValue, oldValue)
							: undefined,
						v: () => {
							registerXv();
							if (!viewScript) {
								return;
							}
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
						},
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
