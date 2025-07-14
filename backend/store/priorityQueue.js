import { MinPriorityQueue} from '@datastructures-js/priority-queue';


const priorityQueue = new MinPriorityQueue((a, b)=> a.priority - b.priority);
const groupKeySet = new Set();  //to track which group keys are in queue


/**
 * Add a group key to priority queue
 * @param {string} groupKey 
 * @param {number} priority 
 */
export function addGroupToPriorityQueue(groupKey, priority){
    if(!groupKeySet.has(groupKey)){
        priorityQueue.enqueue({groupKey, priority});
        groupKeySet.add(groupKey);
    }
}


/**
 * Check if a groupKey is already in Queue
 * @param {string} groupKey 
 */
export function hasGroupInQueue(groupKey){

    return groupKeySet.has(groupKey);
}

/**
 * pop the highest priority group key
 * @returns {string | null}
 */
export function popNextGroup(){
    if(priorityQueue.isEmpty())return null;

    const { groupKey } = priorityQueue.dequeue();
    groupKeySet.delete(groupKey);
    return groupKey;
}

/**
 * Peek the next group key without removing
 * @returns {string | null}
 */
export function peekNextGroup(){
    if(priorityQueue.isEmpty())return null;
    return priorityQueue.front().groupKey;
}

/**
 * Check if priority queue is empty
 */
export function isPriorityQueueEmpty(){
    return priorityQueue.isEmpty();
}


export function printPriorityQueueState() {
    console.log("\n=== 📊 Priority Queue State ===");

    if (priorityQueue.isEmpty()) {
        console.log("  (empty)");
        return;
    }

    // WARNING: This will not mutate the actual queue
    const snapshot = priorityQueue.toArray();

    snapshot.sort((a, b) => a.priority - b.priority); // Ensure sorted by priority

    snapshot.forEach((item, index) => {
        console.log(`  ${index + 1}. GroupKey: ${item.groupKey}, Priority: ${item.priority}`);
    });

    console.log("==============================\n");
}