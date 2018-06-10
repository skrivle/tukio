// @flow

import { Event } from '../types';
import EventHandler from '../event-handler';

describe('EventHandler', () => {
    class Event1 extends Event {}
    class Event2 extends Event {}

    test('EventHandler', () => {
        // GIVEN
        const id = '1';

        // WHEN
        const actual = new EventHandler(id, Event1, jest.fn());

        expect(actual.id).toEqual(id);
    });

    test("tryToHandle should not handle the event if it's an invalid instance", () => {
        // GIVEN
        const handler = jest.fn();
        const eventHandler = new EventHandler('1', Event1, handler);
        const invalidEvent = new Event2();

        // WHEN
        eventHandler.tryToHandle(invalidEvent);

        // THEN
        expect(handler).not.toHaveBeenCalled();
    });

    test('tryToHandle should handle the event', () => {
        // GIVEN
        const handler = jest.fn();
        const eventHandler = new EventHandler('1', Event1, handler);
        const event = new Event1();

        // WHEN
        eventHandler.tryToHandle(event);

        // THEN
        expect(handler).toHaveBeenCalledWith(event);
    });
});
