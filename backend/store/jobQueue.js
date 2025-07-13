import {v4 as uuidv4} from "uuid";
import { jobStore }from "./memoryStore.js";

import {
    addJobToGroup,
    getGroupKey,
    hasGroup
} from "./groupedJobStore.js";

import {addGroupToPriorityQueue} from "./priorityQueue.js";

export function submitJob(data){

    if(!data || !data.org_id || !data.app_version_id || !data.test){
        throw new Error("Missing required fields on job submission");
    }else{
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

        //add to grouped store
        addJobToGroup(data.org_id, data.app_version_id, job);

        //push group key to priority queue only if it's new
        const groupKey = getGroupKey(data.org_id, data.app_version_id);
        if(!hasGroupInQueue(groupKey)){
            addGroupToPriorityQueue(groupKey, job.priority); //just storing group key not the job id
        }



        return job;
    }

    
}


//testing apis
export function getJobById(id){
    return jobStore[id] || null;
}

export function getAllJobs(){
    return Object.values(jobStore);
}

export function getPendingJobs(){
    return Object.values(jobStore).filter(
        job => job.status === "pending"
    );
}

export function updateJobStatus(jobId, newStatus){
    if(jobStore[jobId]){
        jobStore[jobId].status = newStatus;
    }
}

export function incrementRetry(jobId){
    if(jobStore[jobId]){
        jobStore[jobId].retries += 1;
        jobStore[jobId].status = "pending";
    }
}