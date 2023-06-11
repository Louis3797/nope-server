import PriorityQueue from '../../../src/utils/PriorityQueue';

describe('PriorityQueue', () => {
  test('enqueue and dequeue elements', () => {
    const queue = new PriorityQueue<number>();
    queue.enqueue(5, 2);
    queue.enqueue(10, 1);
    queue.enqueue(3, 3);

    expect(queue.dequeue()).toBe(5);
    expect(queue.dequeue()).toBe(3);
    expect(queue.dequeue()).toBe(10);
    expect(queue.isEmpty()).toBe(true);
    expect(queue.dequeue()).toBeNull();
  });

  test('front and rear elements', () => {
    const queue = new PriorityQueue<string>();
    queue.enqueue('apple', 3);
    queue.enqueue('banana', 2);
    queue.enqueue('orange', 1);

    expect(queue.front()).toBe('apple');
    expect(queue.rear()).toBe('orange');
    expect(queue.frontPriority()).toBe(0);
    expect(queue.rearPriority()).toBe(0);

    queue.dequeue();
    expect(queue.front()).toBe('orange');
    expect(queue.rear()).toBe('banana');
    expect(queue.frontPriority()).toBe(0);
    expect(queue.rearPriority()).toBe(0);

    queue.dequeue();
    expect(queue.front()).toBe('banana');
    expect(queue.rear()).toBe('banana');
    expect(queue.frontPriority()).toBe(0);
    expect(queue.rearPriority()).toBe(0);

    queue.dequeue();
    expect(queue.front()).toBeNull();
    expect(queue.rear()).toBeNull();
    expect(queue.frontPriority()).toBeNull();
    expect(queue.rearPriority()).toBeNull();
  });

  test('change element priority', () => {
    const queue = new PriorityQueue<string>();
    queue.enqueue('apple', 3);
    queue.enqueue('banana', 2);
    queue.enqueue('orange', 1);

    queue.changePriority('banana', 4);
    expect(queue.front()).toBe('apple');
    expect(queue.rear()).toBe('orange');
    expect(queue.frontPriority()).toBe(0);
    expect(queue.rearPriority()).toBe(0);

    queue.changePriority('orange', 2);
    expect(queue.front()).toBe('apple');
    expect(queue.rear()).toBe('orange');
    expect(queue.frontPriority()).toBe(0);
    expect(queue.rearPriority()).toBe(2);

    queue.changePriority('apple', 1);
    expect(queue.front()).toBe('apple');
    expect(queue.rear()).toBe('orange');
    expect(queue.frontPriority()).toBe(1);
    expect(queue.rearPriority()).toBe(2);

    queue.changePriority('nonexistent', 5); // Changing priority of non-existent element should have no effect
    expect(queue.front()).toBe('apple');
    expect(queue.rear()).toBe('orange');
    expect(queue.frontPriority()).toBe(1);
    expect(queue.rearPriority()).toBe(2);
  });

  test('size and isEmpty', () => {
    const queue = new PriorityQueue<number>();

    expect(queue.isEmpty()).toBe(true);
    expect(queue.size()).toBe(0);

    queue.enqueue(1, 1);
    queue.enqueue(2, 2);
    queue.enqueue(3, 3);

    expect(queue.isEmpty()).toBe(false);
    expect(queue.size()).toBe(3);

    queue.dequeue();
    queue.dequeue();
    queue.dequeue();

    expect(queue.isEmpty()).toBe(true);
    expect(queue.size()).toBe(0);
  });

  test('print', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const queue = new PriorityQueue<number>();
    queue.enqueue(5, 2);
    queue.enqueue(10, 1);
    queue.enqueue(3, 3);

    queue.print();

    expect(consoleSpy).toHaveBeenCalledWith([
      { element: 5, priority: 0 },
      { element: 10, priority: 0 },
      { element: 3, priority: 0 }
    ]);
    consoleSpy.mockRestore();
  });

  test('changePriority with non-existent element', () => {
    const queue = new PriorityQueue<number>();
    queue.enqueue(5, 2);
    queue.enqueue(10, 1);
    queue.enqueue(3, 3);

    queue.changePriority(8, 4); // Changing priority of non-existent element should have no effect

    expect(queue.front()).toBe(5);
    expect(queue.rear()).toBe(3);
    expect(queue.frontPriority()).toBe(0);
    expect(queue.rearPriority()).toBe(0);
  });
});
