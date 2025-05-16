import * as constants from "@/utils/constants";

class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
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

    temp.prev = this.tail;
    this.tail.next = temp;
    this.tail = this.tail.next;
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

    // get last vip order
    while (current.value && current.next) {
      if (current.value.type === constants.ORDER_TYPE.VIP) {
        current = current.next;
      } else if (current.value.type === constants.ORDER_TYPE.NORMAL) {
        break;
      }
    }

    temp.next = current;
    temp.prev = current.prev;
    if (!current.prev) {
      // is head, no vip order
      this.head = temp;
    } else {
      // is middle, have vip order
      temp.prev.next = temp;
    }
    current.prev = temp;
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
      this.head.prev = null;
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

  printList() {
    let result = "";
    let head = this.head;

    while (head !== null) {
      result += head.value.no + " ";
      head = head.next;
    }

    console.log(result.trim());
  }
}
