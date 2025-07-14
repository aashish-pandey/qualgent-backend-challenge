import { v4 as uuidv4 } from "uuid";
import { jobStore } from "./memoryStore.js";

import {
    addJobToGroup,
    getGroupKey,
    hasGroup
} from "./groupedJobStore.js";

import { addGroupToPriorityQueue, hasGroupInQueue } from "./priorityQueue.js";

/**
 * Submit a new job to the system.
 * Creates a job, adds it to memory store, grouped store, and inserts groupKey into priority queue.
 *
 * @param {object} data - Job submission data
 * @param {string} data.org_id - Organization ID
 * @param {string} data.app_version_id - Application version ID
 * @param {string} data.test - Path to test file
 * @param {string} [data.target="mobile"] - Target platform (default is mobile)
 * @param {number} [data.priority=1] - Job priority
 * @returns {object} The created job object
 * @throws Will throw an error if required fields are missing
 */
export function submitJob(data) {
    if (!data || !data.org_id || !data.app_version_id || !data.test) {
        throw new Error("Missing required fields on job submission");
    } else {
        const job = {
            id: uuidv4(),
            org_id: data.org_id,
            app_version_id: data.app_version_id,
            test_path: data.test,
            target: data.target || "mobile",
            priority: data.priority || 1,
            status: "pending",
            retries: 0,
            created_at: Date.now()
        };

        jobStore[job.id] = job;

        // Add to grouped store
        addJobToGroup(data.org_id, data.app_version_id, job);

        // Push group key to priority queue only if it's new
        const groupKey = getGroupKey(data.org_id, data.app_version_id);
        if (!hasGroupInQueue(groupKey)) {
            addGroupToPriorityQueue(groupKey, job.priority); // just storing group key, not job id
        }

        return job;
    }
}

/**
 * Get a job by its ID.
 *
 * @param {string} id - Job ID
 * @returns {object|null} Job object or null if not found
 */
export function getJobById(id) {
    return jobStore[id] || null;
}

/**
 * Get all jobs in the system.
 *
 * @returns {object[]} Array of all job objects
 */
export function getAllJobs() {
    return Object.values(jobStore);
}

/**
 * Get all jobs with status "pending".
 *
 * @returns {object[]} Array of pending jobs
 */
export function getPendingJobs() {
    return Object.values(jobStore).filter(
        job => job.status === "pending"
    );
}

/**
 * Update the status of a job.
 *
 * @param {string} jobId - Job ID
 * @param {string} newStatus - New status to assign (e.g., "running", "done")
 */
export function updateJobStatus(jobId, newStatus) {
    if (jobStore[jobId]) {
        jobStore[jobId].status = newStatus;
    }
}

/**
 * Increment the retry count for a job and mark it as "pending" again.
 *
 * @param {string} jobId - Job ID
 */
export function incrementRetry(jobId) {
    if (jobStore[jobId]) {
        jobStore[jobId].retries += 1;
        jobStore[jobId].status = "pending";
    }
}

/**
 * Print the current state of the job store for debugging.
 */
export function printJobStoreState() {
    console.log("\n=== Job Store State ===");

    const jobIds = Object.keys(jobStore);
    if (jobIds.length === 0) {
        console.log("No jobs in the store.");
        return;
    }

    jobIds.forEach(id => {
        const job = jobStore[id];
        console.log(`🧪 Job ID: ${id}`);
        console.log(`   Org: ${job.org_id}, App Version: ${job.app_version_id}`);
        console.log(`   Status: ${job.status}, Priority: ${job.priority}, Retries: ${job.retries}`);
        console.log(`   Target: ${job.target}, Test Path: ${job.test_path}`);
        console.log(`   Created At: ${new Date(job.created_at).toLocaleString()}`);
    });

    console.log("\n=================================================");
}
