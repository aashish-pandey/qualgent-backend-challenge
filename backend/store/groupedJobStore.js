const groupedJobStore = new Map();

/**
 * Generate a unique group key from orgId and appVersionId
 */
export function getGroupKey(orgId, appVersionId){
    return `${orgId}|${appVersionId}`;
}

/**
 * Add a job to group queue
 */
export function addJobToGroup(orgId, appVersionId, job){
    const key = getGroupKey(orgId, appVersionId);
    if(!groupedJobStore.has(key)){
        groupedJobStore.set(key, []);
    }
    groupedJobStore.get(key).push(job);
}

/**
 * Get all jobs in a group
 */
export function getJobsInGroup(orgId, appVersionId){
    return groupedJobStore.get(getGroupKey(orgId, appVersionId)) || [];
}

/**
 * Remove and return jobs of a group
 */
export function popGroup(orgId, appVersionId){
    const key = getGroupKey(orgId, appVersionId);
    const jobs = groupedJobStore.get(key) || [];
    groupedJobStore.delete(key);
    return jobs;
}

/**
 * Check if group exists
 */
export function hasGroup(orgId, appVersionId){
    return groupedJobStore.has(getGroupKey(orgId, appVersionId));
}



export function printGroupedJobStoreState() {
    console.log("\n=== 🗂️ Grouped Job Store State ===");

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
