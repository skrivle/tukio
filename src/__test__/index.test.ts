import _ from 'lodash';
import EventBus from '../index';

jest.useFakeTimers();

let eventBus: EventBus;

beforeEach(() => {
    eventBus = new EventBus();
});

test('Subscribe returns a unique reference', () => {
    // GIVEN
    class MyEvent {}

    // WHEN
    const actual = _.chain(50)
        .range()
        .map((i) => eventBus.subscribe(MyEvent, jest.fn()))
        .uniq()
        .value();

    // THEN
    expect(actual).toHaveLength(50);
});

test('Publish triggers the registered handlers', () => {
    // GIVEN
    class MyEvent {}
    const handler = jest.fn();
    eventBus.subscribe(MyEvent, handler);

    // WHEN
    eventBus.publish(new MyEvent());

    // THEN
    expect(handler).toHaveBeenCalled();
    expect(handler.mock.calls[0][0]).toBeInstanceOf(MyEvent);
});

test('publish returns a promise which resolves when all the handlers are finished', async () => {
    // GIVEN
    class MyEvent {}

    const handler1 = () =>
        new Promise<void>((resolve) => {
            setTimeout(resolve, 10000);
        });

    const handler2 = () => Promise.resolve();
    const handler3 = () => {};

    const spy = jest.fn();

    eventBus.subscribe(MyEvent, handler1);
    eventBus.subscribe(MyEvent, handler2);
    eventBus.subscribe(MyEvent, handler3);

    // WHEN
    const promise = eventBus.publish(new MyEvent()).then(() => spy());
    jest.runAllTimers();
    await promise;

    // THEN
    expect(promise).toBeInstanceOf(Promise);
    expect(spy).toHaveBeenCalled();
});

test('Unsubscribe removes the handler', () => {
    // GIVEN
    class MyEvent {}
    const handler = jest.fn();
    const ref = eventBus.subscribe(MyEvent, handler);
    eventBus.unsubscribe(ref);

    // WHEN
    eventBus.publish(new MyEvent());

    // THEN
    expect(handler).not.toHaveBeenCalled();
});

test('UnsubscribeAll removes all handlers', () => {
    // GIVEN
    class Event1 {}
    class Event2 {}
    const event1 = new Event1();
    const event2 = new Event2();
    const handler = jest.fn();

    eventBus.subscribe(Event1, handler);
    eventBus.subscribe(Event2, handler);

    // WHEN
    eventBus.unsubscribeAll();
    eventBus.publish(event1);
    eventBus.publish(event2);

    // THEN
    expect(handler).not.toHaveBeenCalled();
});

test('On is an alias for subscribe', () => {
    // GIVEN
    class Event1 {}
    const handler = () => {};
    const spy = jest.spyOn(eventBus, 'subscribe').mockReturnValue('id-1');

    // WHEN
    const actual = eventBus.on(Event1, handler);

    // EXPECT
    expect(actual).toBe('id-1');
    expect(spy).toHaveBeenCalledWith(Event1, handler);
});

test('Off is an alias for subscribe', () => {
    // GIVEN
    const id = 'id-1';
    const spy = jest.spyOn(eventBus, 'unsubscribe');

    // WHEN
    eventBus.off(id);

    // EXPECT
    expect(spy).toHaveBeenCalledWith(id);
});
