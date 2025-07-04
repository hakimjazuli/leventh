// @ts-check

export class callbacks {
	/**
	 * @param {Object} param0
	 * @param {(attributeName:string, newValue:string, oldValue:string)=>void} [param0.ac]
	 * @param {()=>void} [param0.dc]
	 * @param {()=>void} [param0.v]
	 * @param {()=>void} [param0.xv]
	 */
	constructor({ dc = undefined, ac = undefined, v = undefined, xv = undefined }) {
		this.dc = dc;
		this.ac = ac;
		this.v = v;
		this.xv = xv;
	}
	/**
	 * viewCallback
	 * @type {(()=>void)|undefined}
	 */
	v;
	/**
	 * exitViewCallback
	 * @type {(()=>void)|undefined}
	 */
	xv;
	/**
	 * disconnectedCallback
	 * @type {(()=>void)|undefined}
	 */
	dc;
	/**
	 * attributeChangesCallback
	 * @type {((attributeName:string, newValue:string, oldValue:string)=>void)|undefined}
	 */
	ac;
}
