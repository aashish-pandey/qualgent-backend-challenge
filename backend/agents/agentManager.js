// v1: Simulating a system where agents handle one type of target only (e.g., browserstack)

import { getGroupKey } from "../store/groupedJobStore.js";
import { updateJobStatus } from "../store/jobQueue.js";

// Stores IDs of agents that are currently free
const freeAgents = new Set();

// Maps groupKey (orgId + appVersionId) to agentId (i.e., running agents)
const runningAgents = new Map();

// Maps agentId to their respective job queue
const agentJobQueues = new Map();

/**
 * Register a new agent as free (available to take jobs)
 * @param {string} agentId - Unique identifier of the agent
 */
export function registerAgent(agentId) {
    freeAgents.add(agentId);
}

/**
 * Check if an agent is currently free
 * @param {string} agentId
 * @returns {boolean}
 */
export function isAgentFree(agentId) {
    return freeAgents.has(agentId);
}

/**
 * Assign a free agent to a specific group
 * @param {string} agentId
 * @param {string} orgId
 * @param {string} appVersionId
 */
export function assignAgent(agentId, orgId, appVersionId) {
    freeAgents.delete(agentId);
    const key = getGroupKey(orgId, appVersionId);
    runningAgents.set(key, agentId);
    agentJobQueues.set(agentId, []);
}

/**
 * Find if any agent is currently running jobs for the given group
 * @param {string} orgId
 * @param {string} appVersionId
 * @returns {string|null} agentId or null if not found
 */
export function findAgentForGroup(orgId, appVersionId) {
    const key = getGroupKey(orgId, appVersionId);
    if (runningAgents.has(key)) {
        return runningAgents.get(key);
    }
    return null;
}

/**
 * Push a job to a specific agent's job queue
 * If it's the first job, immediately simulate processing
 * @param {string} agentId
 * @param {object} job
 */
export function pushJobToAgent(agentId, job) {
    if (!agentJobQueues.has(agentId)) {
        agentJobQueues.set(agentId, []);
    }

    const queue = agentJobQueues.get(agentId);
    queue.push(job);

    // Simulate processing only if the queue was empty
    if (queue.length === 1) {
        simulateAgentWork(agentId);
    }
}

/**
 * Release an agent from a group and mark it as free again
 * @param {string} agentId
 * @param {string} orgId
 * @param {string} appVersionId
 */
export function releaseAgent(agentId, orgId, appVersionId) {
    const key = getGroupKey(orgId, appVersionId);
    console.log(key);
    console.log("inside release agent");
    runningAgents.delete(key);
    agentJobQueues.delete(agentId);
    freeAgents.add(agentId);
}

/**
 * Get all currently free agents
 * @returns {Set<string>} Set of agentIds
 */
export function getFreeAgentsId() {
    return new Set(freeAgents);
}

/**
 * Get the current job queue for a given agent
 * @param {string} agentId
 * @returns {object[]} Array of jobs
 */
export function getAgentJobs(agentId) {
    return agentJobQueues.get(agentId) || [];
}

/**
 * Log the current internal state of the agent system
 */
export function printAgentState() {
    console.log("\n=== Agent System State ====");

    console.log("\n Free Agents:");
    if (freeAgents.size === 0) {
        console.log("{ none }");
    } else {
        for (const agentId of freeAgents) {
            console.log(` - ${agentId}`);
        }
    }

    console.log("\nRunning Agents");
    if (runningAgents.size === 0) {
        console.log(" { none }");
    } else {
        for (const [groupKey, agentId] of runningAgents.entries()) {
            console.log(` - ${agentId} running ${groupKey}`);
        }
    }

    console.log("\n Agent job queues:");
    if (agentJobQueues.size === 0) {
        console.log(" { none }");
    } else {
        for (const [agentId, queue] of agentJobQueues.entries()) {
            const jobIds = queue.map(j => j.id);
            console.log(` - ${agentId}: [${jobIds.join(", ")}]`);
        }
    }

    console.log("\n=================================================\n");
}

/**
 * Simulate an agent working on a job from its queue
 * Automatically proceeds to the next job after a delay
 * @param {string} agentId
 */
export function simulateAgentWork(agentId) {
    console.log("inside the simulate agent work");
    console.log(agentId);
    const queue = agentJobQueues.get(agentId);

    if (!queue || queue.length == 0) {
        runningAgents.delete(agentId);
        return;
    }

    const job = queue[0]; // Pick next job

    console.log(`[Agent ${agentId}] started job ${job.id}`);

    setTimeout(() => {
        updateJobStatus(job.id, "done");
        queue.shift(); // Remove completed job

        if (queue.length === 0) {
            releaseAgent(agentId, job.org_id, job.app_version_id);
        } else {
            simulateAgentWork(agentId); // Continue to next
        }
    }, 3000); // Simulated delay
}
