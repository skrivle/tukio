// @flow

import { type Handler } from './types';
import EventHandler from './event-handler';

export default class EventBus {
    _eventHandlers: Array<EventHandler<any>>;
    _currentId: number;

    constructor() {
        this._eventHandlers = [];
        this._currentId = 0;
    }

    _newId(): string {
        this._currentId = this._currentId + 1;
        return `${this._currentId}`;
    }

    publish<E: Object>(event: E): Promise<void> {
        const promises = this._eventHandlers
            .map(eventHandler => eventHandler.tryToHandle(event))
            .filter(promise => !!promise);

        return Promise.all(promises).then(() => undefined);
    }

    subscribe<E: Object>(Event: Class<E>, handler: Handler<E>): string {
        const id = this._newId();
        const eventHandler = new EventHandler(id, Event, handler);

        this._eventHandlers.push(eventHandler);

        return id;
    }

    on<E: Object>(Event: Class<E>, handler: Handler<E>): string {
        return this.subscribe(Event, handler);
    }

    unsubscribe(id: string): void {
        this._eventHandlers = this._eventHandlers.filter(e => e.id !== id);
    }

    off(id: string): void {
        this.unsubscribe(id);
    }

    unsubscribeAll(): void {
        this._eventHandlers = [];
    }
}
