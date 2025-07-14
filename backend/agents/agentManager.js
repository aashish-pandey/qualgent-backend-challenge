//v1: simmulating that we have only one type of target not multiple(e.g. browserstack)

import { getGroupKey } from "../store/groupedJobStore.js";
import { updateJobStatus } from "../store/jobQueue.js";

const freeAgents = new Set();
const runningAgents = new Map();
const agentJobQueues = new Map();

/**
 * Add a new  agent to a system as free
 */
export function registerAgent(agentId){
    freeAgents.add(agentId);
}

/**
 * Check if Agent is free (probably no use of this function in current use case)
 */
export function isAgentFree(agentId){
    return freeAgents.has(agentId);
}

/**
 * Assign new agent to a group . use this function when no agent is running current group
 */
export function assignAgent(agentId, orgId, appVersionId){
    freeAgents.delete(agentId);
    const key =  getGroupKey(orgId, appVersionId);
    runningAgents.set(key, agentId);
    agentJobQueues.set(agentId, []);
}

/**
 * Check if an agent is already running job for given group. 
 */
export function findAgentForGroup(orgId, appVersionId){
    const key = getGroupKey(orgId, appVersionId);
    if(runningAgents.has(key)){
        return runningAgents.get(key);
    }
    return null;
}

/**
 * Push job to an agent's queue. use this when any agent is running the same group. 
 */
export function pushJobToAgent(agentId, job){
    if(!agentJobQueues.has(agentId)){
        agentJobQueues.set(agentId, []);
    }

    const queue = agentJobQueues.get(agentId);
    queue.push(job);

    //if this is the only job, simulate work immediately
    if(queue.length == 1){
        // console.log("agent id inside push job to agent");
        // console.log(agentId);
        simulateAgentWork(agentId);
    }
}

/**
 * Mark agent as free again
 */
export function releaseAgent(agentId, orgId, appVersionId){
    const key = getGroupKey(orgId, appVersionId);
    console.log(key);
    console.log("inside release agent");
    runningAgents.delete(key);
    agentJobQueues.delete(agentId);
    freeAgents.add(agentId);
}

/**
 * Get all free agents
 */
export function getFreeAgentsId(){
    return new Set(freeAgents);
}

/**
 * Get current jobs for debugging/logging
 */
export function getAgentJobs(agentId){
    return agentJobQueues.get(agentId) || [];
}


export function printAgentState(){
    console.log("\n=== Agent System State ====");
    console.log("\n Free Agents:");

    if(freeAgents.size === 0){
        console.log("{ none }");
    }else{
        for(const agentId of freeAgents){
            console.log(` - ${agentId}`);
        }
    }

    console.log("\nRunning Agents");
    if(runningAgents.size === 0){
        console.log(" { none }");
    }else{
        for(const [groupKey, agentId] of runningAgents.entries()){
            console.log(` - ${agentId} running ${groupKey}`);
        }
    }

    console.log("\n Agent job queues:");
    if(agentJobQueues.size === 0){
        console.log(" { none }");
    }else{
        for(const [agentId, queue] of agentJobQueues.entries()){
            const jobIds = queue.map(j => j.id);
            console.log(` - ${agentId}: [${jobIds.join(", ")}]`);
        }
    }

    console.log("\n=================================================\n");
}


//simulating agent work : will be replaced later
export function simulateAgentWork(agentId){
    console.log("inside the simulate agent work");
    console.log(agentId);
    const queue = agentJobQueues.get(agentId);

    if(!queue || queue.length == 0){
        runningAgents.delete(agentId);
        return;
    }
    const job = queue[0]; //get the next job

    console.log(`[Agent ${agentId}] started job ${job.id}`);

    setTimeout(()=>{
        updateJobStatus(job.id, "done");
        // console.log(`[Agent ${agentId} Completed Job ${job.id}]`);
        queue.shift(); //removing job after it is done

        //if no more jobs left, release agent
        if(queue.length === 0){
            releaseAgent(agentId, job.org_id, job.app_version_id);
            // console.log(`[Agent ${agentId}] is now free`);
        }else{
            //continue working on next job
            simulateAgentWork(agentId);
        }

    }, 3000)//simulate 3s work
}