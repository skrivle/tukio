import EventHandler from '../event-handler';

const ID = '1';

class Event1 {}
class Event2 {}

test('EventHandler has an id', () => {
    // GIVEN
    const id = ID;

    // WHEN
    const actual = new EventHandler(id, Event1, jest.fn());

    // THEN
    expect(actual.id).toEqual(id);
});

test("tryToHandle does not handle the event if it's an invalid instance", () => {
    // GIVEN
    const handler = jest.fn();
    const eventHandler = new EventHandler(ID, Event1, handler);
    const invalidEvent = new Event2();

    // WHEN
    eventHandler.tryToHandle(invalidEvent);

    // THEN
    expect(handler).not.toHaveBeenCalled();
});

test('tryToHandle handles the event', () => {
    // GIVEN
    const handler = jest.fn();
    const eventHandler = new EventHandler(ID, Event1, handler);
    const event = new Event1();

    // WHEN
    eventHandler.tryToHandle(event);

    // THEN
    expect(handler).toHaveBeenCalledWith(event);
});

test('tryToHandle returns the promise returned by the handler', () => {
    // GIVEN
    const promise = Promise.resolve();
    const handler = () => promise;
    const eventHandler = new EventHandler(ID, Event1, handler);
    const event = new Event1();

    // WHEN
    const actual = eventHandler.tryToHandle(event);

    // THEN
    expect(actual).toBe(promise);
});
