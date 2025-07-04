// @ts-check

export class qUnique {
	/**
	 * @param {number} ms
	 * @returns {Promise<void>}
	 */
	static #timeout = (ms) =>
		new Promise((resolve) => {
			setTimeout(resolve, ms);
		});

	/**
	 * @typedef {{}|null|number|string|boolean|symbol|bigint|function} anyButUndefined
	 * @typedef {Object} queueUniqueObject
	 * @property {any} i
	 * @property {()=>(any|Promise<any>)} c
	 * @property {number} [d]
	 */
	/**
	 * @type {Map<any, [()=>Promise<any>,number]>}
	 */
	static #queue = new Map();
	/**
	 * @type {boolean}
	 */
	static #isRunning = false;
	/**
	 * @type {(queueUniqueObject:queueUniqueObject)=>void}
	 */
	static assign = (_queue) => {
		qUnique.#push(_queue);
		if (!qUnique.#isRunning) {
			qUnique.#run();
		}
	};
	/**
	 * @param {queueUniqueObject} _queue
	 */
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
			/**
			 * debounce anyway;
			 * queue with unique id have characteristic of messing up when have no debouncer;
			 * especially when request comes too fast;
			 */
			await this.#timeout(debounce);
			await callback();
			keys = keysIterator.next();
		}
		qUnique.#isRunning = false;
	};
}
