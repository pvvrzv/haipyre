export class ListNode {
  constructor() {
    this.prev = null;
    this.next = null;
  }
}

export class List {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  push(node) {
    if (!this.head) {
      this.head = node;
      this.tail = node;
    }
    else {
      node.prev = this.tail;
      this.tail.next = node;
      this.tail = node;
    }

    this.size++;
  }

  pop() {
    if (this.size === 0) return;

    const node = this.tail;

    if (this.size === 1) {
      this.head = null;
      this.tail = null;
    }
    else {
      this.tail.prev.next = null;
      this.tail = this.tail.prev;
    }

    this.size--;

    return node;
  }

  shift(node) {
    if (!this.head) {
      this.head = node;
      this.tail = node;
    }
    else {
      node.next = this.head;
      this.head.prev = node;
      this.head = node;
    }
    this.size++;
  }

  unshift() {
    if (this.size === 0) return;

    const node = this.head;

    if (this.size === 1) {
      this.head = null;
      this.tail = nill;
    }
    else {
      this.head.next.prev = null;
      this.head = this.head.next;
    }

    this.size--;

    return node;
  }

  forEach(callback) {
    if (this.length === 0) return;

    let node = this.head;
    let i = 0;

    while (i < this.size) {
      callback(node, i, this);

      node = node.next;
      i++;
    }
  }

  find(predicate) {
    if (this.size === 0) return;

    let node = this.head;
    let i = 0;

    while (i < this.size) {
      if (predicate(node, i, this) === true) return node;

      node = node.next;
      i++;
    };

    return;
  }
}