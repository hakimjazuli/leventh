// src/callbacks.mjs
class callbacks {
  constructor({ dc = undefined, ac = undefined, v = undefined, xv = undefined }) {
    this.dc = dc;
    this.ac = ac;
    this.v = v;
    this.xv = xv;
  }
  v;
  xv;
  dc;
  ac;
}

// src/getLeventh.export.mjs
var getLeventh = (key, type) => {
  if (!window["leventh"]) {
    window["leventh"] = {};
  }
  if (!(key in window["leventh"])) {
    window["leventh"][key] = undefined;
  }
  return window["leventh"][key];
};

// src/qUnique.mjs
class qUnique {
  static #timeout = (ms) => new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
  static #queue = new Map;
  static #isRunning = false;
  static assign = (_queue) => {
    qUnique.#push(_queue);
    if (!qUnique.#isRunning) {
      qUnique.#run();
    }
  };
  static #push = (_queue) => {
    const { i, c, d } = _queue;
    qUnique.#queue.set(i, [c, d ? d : 0]);
  };
  static #run = async () => {
    qUnique.#isRunning = true;
    const keysIterator = qUnique.#queue.keys();
    let keys = keysIterator.next();
    while (!keys.done) {
      const key = keys.value;
      const data = qUnique.#queue.get(key);
      if (!data) {
        continue;
      }
      const [callback, debounce] = data;
      qUnique.#queue.delete(key);
      await this.#timeout(debounce);
      await callback();
      keys = keysIterator.next();
    }
    qUnique.#isRunning = false;
  };
}

// src/Leventh.mjs
class Leventh {
  static #instance;
  constructor() {
    if (Leventh.#instance) {
      return Leventh.#instance;
    }
    Leventh.#instance = this;
    const namespace = "lvn";
    this.#onloadAttr = `${namespace}:load`;
    this.#onUnloadAttr = `${namespace}:unload`;
    this.#onAttrChangedAttr = `${namespace}:attr-changed`;
    this.#onViewAttr = `${namespace}:view`;
    this.#onExitViewAttr = `${namespace}:exit-view`;
    this.#initatorSelector = `[${namespace}\\:load],[${namespace}\\:unload],[${namespace}\\:attr-changed],[${namespace}\\:view],[${namespace}\\:exit-view]`;
    this.#init();
  }
  #onloadAttr;
  #initatorSelector;
  #onUnloadAttr;
  #onAttrChangedAttr;
  #onViewAttr;
  #onExitViewAttr;
  #mappedLifecycle = new WeakMap;
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
      if ((unloadScript || attrChangedScript || viewScript || exitViewScript) && !this.#mappedLifecycle.has(element)) {
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
          const handler = getLeventh(exitViewScript, "exitView");
          const unObserve = () => this.#unobserveIntersection(element);
          if (handler) {
            ref.xv = () => ref.xv = () => handler({ element, stopExitViewCallback, stopViewCallback, unObserve });
            return;
          }
          new Function("unObserve", "stopExitViewCallback", `stopViewCallback`, `${exitViewScript}({element:this,unObserve,stopExitViewCallback,stopViewCallback})`).call(element, unObserve, stopExitViewCallback, stopViewCallback);
        };
        let dcHandler = undefined;
        if (unloadScript) {
          const handler = getLeventh(unloadScript, "unload");
          if (!handler) {
            dcHandler = () => new Function(`${unloadScript}(this)`).call(element);
          } else {
            dcHandler = () => handler(element);
          }
        }
        let acHandler = undefined;
        if (attrChangedScript) {
          const handler = getLeventh(attrChangedScript, "attrChanged");
          if (handler) {
            acHandler = (attributeName, newValue, oldValue) => {
              handler({ element, attributeName, newValue, oldValue });
            };
          } else {
            acHandler = (attributeName, newValue, oldValue) => {
              new Function("attributeName", "newValue", "oldValue", `${attrChangedScript}({element:this,attributeName,newValue,oldValue})`).call(element, attributeName, newValue, oldValue);
            };
          }
        }
        let vHandler = undefined;
        if (viewScript) {
          registerXv();
          const handler = getLeventh(viewScript, "view");
          if (handler) {
            vHandler = () => handler({
              element,
              stopViewCallback,
              unObserve: () => this.#unobserveIntersection(element)
            });
          } else {
            vHandler = () => new Function("unObserve", `stopViewCallback`, `${viewScript}({element:this,unObserve,stopViewCallback})`).call(element, () => this.#unobserveIntersection(element), () => {
              const mapped = this.#mappedLifecycle.get(element);
              if (!mapped) {
                return;
              }
              mapped.v = undefined;
            });
          }
        }
        this.#mappedLifecycle.set(element, new callbacks({
          dc: dcHandler,
          ac: acHandler,
          v: vHandler
        }));
        if (viewScript || exitViewScript) {
          this.#observeIntersection(element);
        }
      }
      const onloadScript = element.getAttribute(this.#onloadAttr);
      element.removeAttribute(this.#onloadAttr);
      if (!onloadScript) {
        return;
      }
      const loadHandler = getLeventh(onloadScript, "load");
      if (loadHandler) {
        loadHandler(element);
        return;
      }
      new Function(`${onloadScript}(this)`).call(element);
    } catch (error) {
      console.error(`${this.#onloadAttr} error:`, error);
    }
  };
  #scanDeleted = (node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    this.#unload(node);
    for (const child of node.children) {
      this.#scanDeleted(child);
    }
  };
  #unload = async (element) => {
    try {
      const callbacks2 = this.#mappedLifecycle.get(element);
      if (!callbacks2 || !callbacks2.dc) {
        return;
      }
      this.#mappedLifecycle.delete(element);
      callbacks2.dc();
    } catch (error) {
      console.error(`${this.#onUnloadAttr} error:`, error);
    }
  };
  #attrChanged = (element, attributeName, newValue, oldValue) => {
    if (!(element instanceof HTMLElement)) {
      return;
    }
    try {
      const callbacks2 = this.#mappedLifecycle.get(element);
      if (!callbacks2 || !callbacks2.ac) {
        return;
      }
      callbacks2.ac(attributeName, newValue, oldValue);
    } catch (error) {
      console.error(`${this.#onAttrChangedAttr} error:`, error);
    }
  };
  #interSectionObserver = new IntersectionObserver((entries) => {
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
  }, {
    threshold: 0
  });
  #observeIntersection(element) {
    this.#interSectionObserver.observe(element);
  }
  #unobserveIntersection(element) {
    this.#interSectionObserver.unobserve(element);
  }
  #init() {
    document.querySelectorAll(this.#initatorSelector).forEach((element) => {
      this.#invokeAndStrip(element);
    });
    new MutationObserver((mutations) => {
      qUnique.assign({
        i: mutations,
        c: async () => {
          for (const {
            type,
            addedNodes,
            removedNodes,
            attributeName,
            attributeNamespace,
            oldValue,
            target
          } of mutations) {
            switch (type) {
              case "childList":
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
              case "attributes":
                {
                  const element = target;
                  if (!(element instanceof HTMLElement)) {
                    continue;
                  }
                  const att = attributeName ? attributeName : attributeNamespace ? attributeNamespace : "";
                  this.#attrChanged(element, att, element.getAttribute(att) ?? "", oldValue ?? "");
                }
                break;
            }
          }
        }
      });
    }).observe(document, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeOldValue: true
    });
  }
}

// dev/leventh.mjs
new Leventh;
