export class qUnique {
    /**
     * @param {number} ms
     * @returns {Promise<void>}
     */
    static "__#1@#timeout": (ms: number) => Promise<void>;
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
    static "__#1@#queue": Map<any, [() => Promise<any>, number]>;
    /**
     * @type {boolean}
     */
    static "__#1@#isRunning": boolean;
    /**
     * @type {(queueUniqueObject:queueUniqueObject)=>void}
     */
    static assign: (queueUniqueObject: {
        i: any;
        c: () => (any | Promise<any>);
        d?: number;
    }) => void;
    /**
     * @param {queueUniqueObject} _queue
     */
    static "__#1@#push": (_queue: {
        i: any;
        c: () => (any | Promise<any>);
        d?: number;
    }) => void;
    static "__#1@#run": () => Promise<void>;
}
