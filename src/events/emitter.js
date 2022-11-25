export default class EventEmmiter {
  constructor() {
    this.events = new Map();
  }

  addEventListener(name, listener) {
    const event = this.events.get(name);
    if (event) event.add(listener);
    else this.events.set(name, new Set([listener]));
  }

  removeEventListener(name, listener) {
    const event = this.events.get(name);
    if (event) event.delete(listener);
  }

  dispatchEvent(name, ...args) {
    const event = this.events.get(name);
    if (!event) return;
    for (const listener of event) {
      listener(...args);
    }
  }
}
