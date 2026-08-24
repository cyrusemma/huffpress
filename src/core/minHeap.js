/**
 * Min-Heap Priority Queue implementation from scratch.
 * Operates on nodes with structure: { id, char, freq, left, right, isLeaf }
 * Time Complexity:
 *   - Insert: O(log N)
 *   - ExtractMin: O(log N)
 *   - Peek: O(1)
 *   - Size: O(1)
 */
export class MinHeap {
  constructor() {
    this.heap = [];
  }

  /**
   * Helper to get parent index
   */
  getParentIndex(i) {
    return Math.floor((i - 1) / 2);
  }

  /**
   * Helper to get left child index
   */
  getLeftChildIndex(i) {
    return 2 * i + 1;
  }

  /**
   * Helper to get right child index
   */
  getRightChildIndex(i) {
    return 2 * i + 2;
  }

  /**
   * Compare two nodes: returns true if a < b
   * Compares by frequency first, then by node id for stable, deterministic ordering.
   */
  compare(a, b) {
    if (a.freq !== b.freq) {
      return a.freq < b.freq;
    }
    // Tie-breaker
    return (a.id || 0) < (b.id || 0);
  }

  /**
   * Swap elements at index i and j
   */
  swap(i, j) {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }

  /**
   * Insert a node into the min-heap
   * @param {Object} node
   */
  insert(node) {
    this.heap.push(node);
    this.heapifyUp(this.heap.length - 1);
  }

  /**
   * Restore heap invariant upwards
   */
  heapifyUp(index) {
    let current = index;
    while (current > 0) {
      const parent = this.getParentIndex(current);
      if (this.compare(this.heap[current], this.heap[parent])) {
        this.swap(current, parent);
        current = parent;
      } else {
        break;
      }
    }
  }

  /**
   * Extract and return the minimum node
   * @returns {Object|null}
   */
  extractMin() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown(0);
    return min;
  }

  /**
   * Restore heap invariant downwards
   */
  heapifyDown(index) {
    let current = index;
    const length = this.heap.length;

    while (this.getLeftChildIndex(current) < length) {
      let smallest = current;
      const left = this.getLeftChildIndex(current);
      const right = this.getRightChildIndex(current);

      if (left < length && this.compare(this.heap[left], this.heap[smallest])) {
        smallest = left;
      }

      if (right < length && this.compare(this.heap[right], this.heap[smallest])) {
        smallest = right;
      }

      if (smallest !== current) {
        this.swap(current, smallest);
        current = smallest;
      } else {
        break;
      }
    }
  }

  /**
   * Peek at the minimum element without removing it
   */
  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  /**
   * Get total number of elements
   */
  size() {
    return this.heap.length;
  }

  /**
   * Check if heap is empty
   */
  isEmpty() {
    return this.heap.length === 0;
  }

  /**
   * Returns a shallow copy of the heap array (for snapshots & visualizer)
   */
  getHeapArray() {
    return [...this.heap];
  }
}
