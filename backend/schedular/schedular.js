import { isPriorityQueueEmpty, popNextGroup, peekNextGroup, printPriorityQueueState } from "../store/priorityQueue.js";
import { getJobsInGroup, popGroup, printGroupedJobStoreState } from "../store/groupedJobStore.js";
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
import { updateJobStatus, printJobStoreState } from "../store/jobQueue.js";


export function debugAllStates() {
    console.log("\n================= 🔍 DEBUG SYSTEM STATE =================");

    printAgentState();
    printGroupedJobStoreState();
    printPriorityQueueState();
    printJobStoreState();

    console.log("=========================================================\n");
}


//Simulated worker loop (can later be upgraded to actual agent messaging)
export function schedularLoop(){
    setInterval(()=>{
        debugAllStates();
        
        if(isPriorityQueueEmpty()){
            console.log("Priority Queue empty");
            return;
        }

        const groupKey = peekNextGroup();

        if(!groupKey){
            console.log("No group key found");
            return;
        }

        const [orgId, appVersionId] = groupKey.split("|");
        const jobs = getJobsInGroup(orgId, appVersionId);

        if(jobs.length == 0){
            console.log("No pending jobs found")
            return;
        }

        const existingAgent = findAgentForGroup(orgId, appVersionId);

        if(existingAgent){
            console.log(`Assigning ${jobs.length} jobs to existing agent`);
            jobs.forEach(job => {
                updateJobStatus(job.id, "running");
                pushJobToAgent(existingAgent, job);
            });
            popNextGroup(); //removing the added job from priority queue a.k.a. ready queue
        }else{
            console.log(`Assigning ${jobs.length} jobs to new agent`);
            const freeAgents = getFreeAgentsId();
            console.log(freeAgents);
            console.log(freeAgents.size);
            if(freeAgents.size > 0){
                const availableAgent = freeAgents.values().next().value;
                assignAgent(availableAgent, orgId, appVersionId);

                jobs.forEach(job=>{
                    updateJobStatus(job.id, "running");
                    pushJobToAgent(availableAgent, job);
                });
                popNextGroup();
            }else{
                console.log("No free agents - will retry in next loop");
            }

           
        }


    }, 3000) //Pool every one second
}

