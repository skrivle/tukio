// @flow

import type { Handler } from './types';

export default class EventHandler<E: Object> {
    _id: string;
    _Event: Class<E>;
    _handler: Handler<E>;

    constructor(id: string, Event: Class<E>, handler: Handler<E>) {
        this._id = id;
        this._Event = Event;
        this._handler = handler;
    }

    tryToHandle<T: Object>(event: T): ?Promise<void> {
        if (event instanceof this._Event) {
            return this._handler(event) || Promise.resolve();
        }
    }

    get id(): string {
        return this._id;
    }
}
