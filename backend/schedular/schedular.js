import {
  isPriorityQueueEmpty,
  popNextGroup,
  peekNextGroup,
  printPriorityQueueState
} from "../store/priorityQueue.js";

import {
  getJobsInGroup,
  popGroup,
  printGroupedJobStoreState
} from "../store/groupedJobStore.js";

import {
  findAgentForGroup,
  assignAgent,
  pushJobToAgent,
  getAgentJobs,
  releaseAgent,
  registerAgent,
  isAgentFree,
  getFreeAgentsId,
  printAgentState
} from "../agents/agentManager.js";

import {
  updateJobStatus,
  printJobStoreState
} from "../store/jobQueue.js";

/**
 * Prints the current internal state of the system:
 * - Agents
 * - Grouped jobs
 * - Priority queue
 * - Job store
 *
 * Used for debugging and visualization.
 *
 * @function
 */
export function debugAllStates() {
  console.log("\n================= DEBUG SYSTEM STATE =================");

  printAgentState();
  printGroupedJobStoreState();
  printPriorityQueueState();
  printJobStoreState();

  console.log("=========================================================\n");
}

/**
 * Scheduler loop that continuously:
 * 1. Peeks at the next job group in the priority queue.
 * 2. Finds jobs for that group.
 * 3. Checks if an agent is already handling that group:
 *    - If yes → Push jobs to that agent's queue.
 *    - If no  → Assign a free agent if available.
 * 4. Pops the group from the priority queue once assigned.
 *
 * If no free agent is found, retries in the next loop.
 *
 * @function
 * @returns {void}
 */
export function schedularLoop() {
  setInterval(() => {
    debugAllStates();

    if (isPriorityQueueEmpty()) {
      console.log("Priority Queue empty");
      return;
    }

    const groupKey = peekNextGroup();

    if (!groupKey) {
      console.log("No group key found");
      return;
    }

    const [orgId, appVersionId] = groupKey.split("|");
    const jobs = getJobsInGroup(orgId, appVersionId);

    if (jobs.length === 0) {
      console.log("No pending jobs found");
      return;
    }

    const existingAgent = findAgentForGroup(orgId, appVersionId);

    if (existingAgent) {
      /**
       * Existing agent is already running this app version,
       * just push jobs to its queue.
       */
      console.log(`Assigning ${jobs.length} jobs to existing agent`);
      jobs.forEach(job => {
        updateJobStatus(job.id, "running");
        pushJobToAgent(existingAgent, job);
      });
      popNextGroup();
    } else {
      /**
       * No agent currently running this group — assign to free agent if available.
       */
      console.log(`Assigning ${jobs.length} jobs to new agent`);
      const freeAgents = getFreeAgentsId();

      if (freeAgents.size > 0) {
        const availableAgent = freeAgents.values().next().value;
        assignAgent(availableAgent, orgId, appVersionId);

        jobs.forEach(job => {
          updateJobStatus(job.id, "running");
          pushJobToAgent(availableAgent, job);
        });

        popNextGroup();
      } else {
        console.log("No free agents - will retry in next loop");
      }
    }
  }, 3000); // Run loop every 3 seconds
}
