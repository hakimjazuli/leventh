export function getLeventh<T extends "load" | "unload" | "attrChanged" | "view" | "exitView">(key: string, type: T): T extends "load" ? onLoad_onUnloadFunction : T extends "unload" ? onLoad_onUnloadFunction : T extends "view" ? onViewFunction : T extends "exitView" ? onExitViewFunction : T extends "attrChanged" ? onAttrChangedFunction : undefined;
/**
 * *
 */
export type onLoad_onUnloadFunction = (element: HTMLElement) => void;
/**
 * *
 */
export type onAttrChangedFunction = (param0: {
    element: HTMLElement;
    attributeName: string;
    newValue: string;
    oldValue: string;
}) => void;
/**
 * *
 */
export type onViewFunction = (param0: {
    element: HTMLElement;
    unObserve: () => void;
    stopViewCallback: () => void;
}) => void;
/**
 * *
 */
export type onExitViewFunction = (param0: {
    element: HTMLElement;
    unObserve: () => void;
    stopViewCallback: () => void;
    stopExitViewCallback: () => void;
}) => void;
