/* eslint-disable @typescript-eslint/no-non-null-assertion */
interface QueueElement<T> {
  element: T;
  priority: number;
}

export default class PriorityQueue<T> {
  private items: Array<QueueElement<T>>;
  private readonly compare: (a: QueueElement<T>, b: QueueElement<T>) => number;

  constructor(
    array?: T[],
    compare?: (a: QueueElement<T>, b: QueueElement<T>) => number
  ) {
    this.items = [];
    this.compare = compare ?? ((a, b) => a.priority - b.priority);

    if (array) {
      array.forEach((item) => {
        this.enqueue(item, 0);
      });
    }
  }

  enqueue(element: T, priority: number) {
    const queueElement = { element, priority };
    this.items.push(queueElement);
    this.bubbleUp(this.items.length - 1);
  }

  dequeue(): T | null {
    if (this.isEmpty()) {
      return null;
    }
    const root = this.items[0];
    const last = this.items.pop();
    if (this.items.length > 0 && last) {
      this.items[0] = last;
      this.sinkDown(0);
    }
    return root?.element ?? null;
  }

  front(): T | null {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[0]?.element ?? null;
  }

  frontPriority(): number | null {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[0]?.priority ?? null;
  }

  rear(): T | null {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[this.items.length - 1]?.element ?? null;
  }

  rearPriority(): number | null {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[this.items.length - 1]?.priority ?? null;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  print() {
    console.log(this.items);
  }

  changePriority(element: T, priority: number) {
    const index = this.items.findIndex((item) => item.element === element);
    if (index !== -1) {
      this.items[index]!.priority = priority;
      this.bubbleUp(index);
      this.sinkDown(index);
    }
  }

  private bubbleUp(index: number) {
    let parentIndex = Math.floor((index - 1) / 2);
    while (
      index > 0 &&
      this.compare(this.items[index]!, this.items[parentIndex]!) < 0
    ) {
      if (this.items[parentIndex] && this.items[index]) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        [this.items[parentIndex], this.items[index]] = [
          this.items[index],
          this.items[parentIndex]
        ];
      }
      index = parentIndex;
      parentIndex = Math.floor((index - 1) / 2);
    }
  }

  private sinkDown(index: number) {
    const leftChildIndex = index * 2 + 1;
    const rightChildIndex = index * 2 + 2;
    let swapIndex = index;
    if (
      leftChildIndex < this.items.length &&
      this.compare(this.items[leftChildIndex]!, this.items[swapIndex]!) < 0
    ) {
      swapIndex = leftChildIndex;
    }
    if (
      rightChildIndex < this.items.length &&
      this.compare(this.items[rightChildIndex]!, this.items[swapIndex]!) < 0
    ) {
      swapIndex = rightChildIndex;
    }
    if (swapIndex !== index) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      [this.items[index], this.items[swapIndex]] = [
        this.items[swapIndex],
        this.items[index]
      ];
      this.sinkDown(swapIndex);
    }
  }
}
