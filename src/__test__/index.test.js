// @flow

import _ from 'lodash';
import EventBus from '../index';
import { Event } from '../types';

describe('EventBus', () => {
    let eventBus = new EventBus();

    beforeEach(() => {});

    test('Subscribe should return a unique reference', () => {
        // GIVEN
        class MyEvent extends Event {}

        // WHEN
        const actual = _.chain(50)
            .range()
            .map(i => eventBus.subscribe(MyEvent, jest.fn()))
            .uniq()
            .value();

        // THEN
        expect(actual).toHaveLength(50);
    });

    test('Publish should trigger the registered handlers', () => {
        // GIVEN
        class MyEvent extends Event {}
        const handler = jest.fn();
        eventBus.subscribe(MyEvent, handler);

        // WHEN
        eventBus.publish(new MyEvent());

        // THEN
        expect(handler).toHaveBeenCalled();
        expect(handler.mock.calls[0][0]).toBeInstanceOf(MyEvent);
    });

    test('Unsubscribe should remove the handler', () => {
        // GIVEN
        class MyEvent extends Event {}
        const handler = jest.fn();
        const ref = eventBus.subscribe(MyEvent, handler);
        eventBus.unsubscribe(ref);

        // WHEN
        eventBus.publish(new MyEvent());

        // THEN
        expect(handler).not.toHaveBeenCalled();
    });

    test('UnsubscribeAll should remove all handlers', () => {
        // GIVEN
        class Event1 extends Event {}
        class Event2 extends Event {}
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

    test('On should be an alias for subscribe', () => {
        // GIVEN
        class Event1 extends Event {}
        const handler = () => {};
        const spy = jest.spyOn(eventBus, 'subscribe').mockReturnValue('id-1');

        // spy.

        // WHEN
        const actual = eventBus.on(Event1, handler);

        // EXPECT
        expect(actual).toBe('id-1');
        expect(spy).toHaveBeenCalledWith(Event1, handler);
    });

    test('Off should be an alias for subscribe', () => {
        // GIVEN
        const id = 'id-1';
        const spy = jest.spyOn(eventBus, 'unsubscribe');

        // WHEN
        eventBus.off(id);

        // EXPECT
        expect(spy).toHaveBeenCalledWith(id);
    });
});
