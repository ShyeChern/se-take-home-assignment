import * as constants from "@/utils/constants";

class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}
export class OrderLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.total = 0;
    this.completedOrders = [];
  }
  append(val) {
    let temp = new Node(val);
    if (!this.head) {
      this.head = temp;
      this.tail = temp;
      this.total = 1;
      return;
    }

    this.tail.next = temp;
    this.tail = temp;
    this.total++;
  }

  prepend(val) {
    let temp = new Node(val);
    if (!this.head) {
      this.head = temp;
      this.tail = temp;
      this.total = 1;
      return;
    }

    let current = this.head;

    // first element is normal order
    if (current.value.type === constants.ORDER_TYPE.NORMAL) {
      temp.next = this.head
      this.head = temp
      this.total++;
      return
    }

    // get last vip order position
    while (current?.next) {
      if (current.next.value.type === constants.ORDER_TYPE.VIP) {
        current = current.next;
        continue;
      }
      break;
    }
    // set tail if it is last one
    if (!current?.next) {
      this.tail = temp
    }
    temp.next = current.next
    current.next = temp
    this.total++;
  }

  removeHead() {
    if (!this.head) return;

    const value = this.head.value;

    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
    } else {
      this.head = this.head.next;
    }

    this.completedOrders.push(value);
    this.total--;

    return value;
  }

  pendingOrders() {
    let current = this.head;
    let result = [];
    while (current) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  }
}
