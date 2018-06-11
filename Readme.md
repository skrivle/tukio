# Tukio

Tukio is a minimal Pub-Sub implementation using class based events.

## Why

Most of the javascript Pub-Sub implementations use string based events, which makes it impossible
for static type analysers like Flow to infer the shape of an event inside an event handler. Tukio
resolves this by using class based events.

## Installation:

```
npm install tukio --save
```

## Usage:

```javascript
import EventBus from 'tukio';

const eventBus = new EventBus();

class TodoNameUpdated {
    constructor(name) {
        this.name = name;
    }
}

eventBus.subscribe(TodoNameUpdated, event => {
    // Flow knowns that event has a property name
    console.log(event.name);
});

eventBus.publish(new TodoNameUpdated('new name'));
```
