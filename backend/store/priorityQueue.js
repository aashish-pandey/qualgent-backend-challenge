import { MinPriorityQueue } from '@datastructures-js/priority-queue';

/**
 * In-memory priority queue to manage group job execution order.
 * Each item: { groupKey: string, priority: number }
 */
const priorityQueue = new MinPriorityQueue((a, b) => a.priority - b.priority);

/**
 * Set to track which groupKeys are currently in the queue.
 * Prevents duplicates in the priority queue.
 */
const groupKeySet = new Set();

/**
 * Add a group key to the priority queue if not already present.
 * Ensures uniqueness using the `groupKeySet`.
 * 
 * @param {string} groupKey - Unique identifier for a group (e.g., orgId|appVersionId)
 * @param {number} priority - Priority value (lower = higher priority)
 */
export function addGroupToPriorityQueue(groupKey, priority) {
    if (!groupKeySet.has(groupKey)) {
        priorityQueue.enqueue({ groupKey, priority });
        groupKeySet.add(groupKey);
    }
}

/**
 * Check whether a group key is already in the priority queue.
 * 
 * @param {string} groupKey - Group identifier to check
 * @returns {boolean} - True if group is in the queue
 */
export function hasGroupInQueue(groupKey) {
    return groupKeySet.has(groupKey);
}

/**
 * Remove and return the group key with the highest priority.
 * 
 * @returns {string|null} - Group key with highest priority or null if empty
 */
export function popNextGroup() {
    if (priorityQueue.isEmpty()) return null;

    const { groupKey } = priorityQueue.dequeue();
    groupKeySet.delete(groupKey);
    return groupKey;
}

/**
 * View the group key with the highest priority without removing it.
 * 
 * @returns {string|null} - Next group key or null if queue is empty
 */
export function peekNextGroup() {
    if (priorityQueue.isEmpty()) return null;
    return priorityQueue.front().groupKey;
}

/**
 * Check whether the priority queue is empty.
 * 
 * @returns {boolean} - True if queue is empty
 */
export function isPriorityQueueEmpty() {
    return priorityQueue.isEmpty();
}

/**
 * Log the current state of the priority queue to the console.
 * Sorted by priority (lower = higher).
 */
export function printPriorityQueueState() {
    console.log("\n=== Priority Queue State ===");

    if (priorityQueue.isEmpty()) {
        console.log("  (empty)");
        return;
    }

    // Snapshot without mutating the actual queue
    const snapshot = priorityQueue.toArray();
    snapshot.sort((a, b) => a.priority - b.priority);

    snapshot.forEach((item, index) => {
        console.log(`  ${index + 1}. GroupKey: ${item.groupKey}, Priority: ${item.priority}`);
    });

    console.log("==============================\n");
}
