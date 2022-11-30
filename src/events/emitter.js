import { createBound } from '../utils/utils.js';

export default class EventEmmiter {
  constructor() {
    this.events = {
      custom: new Map(),
      default: new Map(),
    };

    createBound.call(this, ['_preventDefault']);

    this.preventDefault = false;
  }

  addEventListener(name, listener, options = { default: false }) {
    const eventGroup = options.default ? this.events.default : this.events.custom;
    const event = eventGroup.get(name);
    if (event) event.add(listener);
    else eventGroup.set(name, new Set([listener]));
  }

  removeEventListener(name, listener, options = { default: false }) {
    const event = options.default ? this.events.default.get(name) : this.events.custom.get(name);
    if (event) event.delete(listener);
  }

  dispatchEvent(name, ...args) {
    const customEvents = this.events.custom.get(name);
    const defaultEvents = this.events.default.get(name);
    const event = {
      name,
      preventDefault: this._preventDefault,
      ...args,
    };

    if (customEvents) {
      for (const listener of customEvents) {
        listener(event);
      }
    }

    if (defaultEvents && !this.preventDefault) {
      for (const listener of defaultEvents) {
        listener(event);
      }
    }

    this.preventDefault = false;
  }

  _preventDefault() {
    this.preventDefault = true;
  }
}
