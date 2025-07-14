const groupedJobStore = new Map();

/**
 * Generate a unique group key from orgId and appVersionId.
 *
 * @param {string} orgId - Organization ID
 * @param {string} appVersionId - App version ID
 * @returns {string} Unique group key in format "orgId|appVersionId"
 */
export function getGroupKey(orgId, appVersionId) {
    return `${orgId}|${appVersionId}`;
}

/**
 * Add a job to the corresponding group queue.
 * Initializes the group queue if it doesn't exist.
 *
 * @param {string} orgId - Organization ID
 * @param {string} appVersionId - App version ID
 * @param {object} job - Job object to be added
 */
export function addJobToGroup(orgId, appVersionId, job) {
    const key = getGroupKey(orgId, appVersionId);
    if (!groupedJobStore.has(key)) {
        groupedJobStore.set(key, []);
    }
    groupedJobStore.get(key).push(job);
}

/**
 * Get all jobs belonging to a specific group.
 *
 * @param {string} orgId - Organization ID
 * @param {string} appVersionId - App version ID
 * @returns {object[]} Array of job objects in the group (or empty array)
 */
export function getJobsInGroup(orgId, appVersionId) {
    return groupedJobStore.get(getGroupKey(orgId, appVersionId)) || [];
}

/**
 * Remove and return all jobs from a group.
 *
 * @param {string} orgId - Organization ID
 * @param {string} appVersionId - App version ID
 * @returns {object[]} Array of job objects that were in the group
 */
export function popGroup(orgId, appVersionId) {
    const key = getGroupKey(orgId, appVersionId);
    const jobs = groupedJobStore.get(key) || [];
    groupedJobStore.delete(key);
    return jobs;
}

/**
 * Check if a group exists in the store.
 *
 * @param {string} orgId - Organization ID
 * @param {string} appVersionId - App version ID
 * @returns {boolean} True if the group exists, false otherwise
 */
export function hasGroup(orgId, appVersionId) {
    return groupedJobStore.has(getGroupKey(orgId, appVersionId));
}

/**
 * Print a debug log of the current grouped job store.
 *
 * @function
 */
export function printGroupedJobStoreState() {
    console.log("\n=== Grouped Job Store State ===");

    if (groupedJobStore.size === 0) {
        console.log("  (empty)");
        return;
    }

    for (const [groupKey, jobs] of groupedJobStore.entries()) {
        console.log(`\nGroup: ${groupKey}`);
        jobs.forEach((job, idx) => {
            console.log(`  ${idx + 1}. Job ID: ${job.id}, Status: ${job.status}`);
        });
    }

    console.log("==================================\n");
}
