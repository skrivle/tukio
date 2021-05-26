export type Handler<E> = (event: E) => Promise<void> | void;
export type Class<T> = new (...args: any[]) => T;
