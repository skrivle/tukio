// @flow

export type Handler<E> = (event: E) => ?Promise<void>;
