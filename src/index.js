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

    _newId() {
        this._currentId = this._currentId + 1;
        return `${this._currentId}`;
    }

    publish<E: Object>(event: E) {
        this._eventHandlers.forEach(eventHandler => {
            eventHandler.tryToHandle(event);
        });
    }

    subscribe<E: Object>(Event: Class<E>, handler: Handler<E>) {
        const id = this._newId();
        const eventHandler = new EventHandler(id, Event, handler);

        this._eventHandlers.push(eventHandler);

        return id;
    }

    on<E: Object>(Event: Class<E>, handler: Handler<E>) {
        return this.subscribe(Event, handler);
    }

    unsubscribe(id: string) {
        this._eventHandlers = this._eventHandlers.filter(e => e.id !== id);
    }

    off(id: string) {
        this.unsubscribe(id);
    }

    unsubscribeAll() {
        this._eventHandlers = [];
    }
}
