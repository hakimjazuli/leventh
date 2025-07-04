export class callbacks {
    /**
     * @param {Object} param0
     * @param {(attributeName:string, newValue:string, oldValue:string)=>void} [param0.ac]
     * @param {()=>void} [param0.dc]
     * @param {()=>void} [param0.v]
     * @param {()=>void} [param0.xv]
     */
    constructor({ dc, ac, v, xv }: {
        ac?: (attributeName: string, newValue: string, oldValue: string) => void;
        dc?: () => void;
        v?: () => void;
        xv?: () => void;
    });
    /**
     * disconnectedCallback
     * @type {(()=>void)|undefined}
     */
    dc: (() => void) | undefined;
    /**
     * attributeChangesCallback
     * @type {((attributeName:string, newValue:string, oldValue:string)=>void)|undefined}
     */
    ac: ((attributeName: string, newValue: string, oldValue: string) => void) | undefined;
    /**
     * viewCallback
     * @type {(()=>void)|undefined}
     */
    v: (() => void) | undefined;
    /**
     * exitViewCallback
     * @type {(()=>void)|undefined}
     */
    xv: (() => void) | undefined;
}
