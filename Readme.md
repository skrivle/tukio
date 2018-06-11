# Tukio

Tukio is a minimal Pub-Sub implementation using class based events.

## Installation:

```
npm install tukio --save
```

## Usage:

```javascript
import EventBus from 'tukio';

const eventBus = new EventBus();

class MyEvent {}

eventBus.subscribe(MyEvent, event => {
    // handle event
});

eventBus.publish(new MyEvent());
```
