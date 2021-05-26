import { Class, Handler } from './types';
import EventHandler from './event-handler';

export default class EventBus {
    private _eventHandlers: Array<EventHandler<any>>;
    private _currentId: number;

    constructor() {
        this._eventHandlers = [];
        this._currentId = 0;
    }

    private _newId(): string {
        this._currentId = this._currentId + 1;
        return `${this._currentId}`;
    }

    public publish<E = Object>(event: E): Promise<void> {
        const promises = this._eventHandlers
            .map((eventHandler) => eventHandler.tryToHandle(event))
            .filter((promise) => !!promise);

        return Promise.all(promises).then(() => undefined);
    }

    public subscribe<E = Object>(Event: Class<E>, handler: Handler<E>): string {
        const id = this._newId();
        const eventHandler = new EventHandler(id, Event, handler);

        this._eventHandlers.push(eventHandler);

        return id;
    }

    public on<E = Object>(Event: Class<E>, handler: Handler<E>): string {
        return this.subscribe(Event, handler);
    }

    public unsubscribe(id: string): void {
        this._eventHandlers = this._eventHandlers.filter((e) => e.id !== id);
    }

    public off(id: string): void {
        this.unsubscribe(id);
    }

    public unsubscribeAll(): void {
        this._eventHandlers = [];
    }
}
