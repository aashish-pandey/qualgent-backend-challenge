import { isPriorityQueueEmpty, popNextGroup, peekNextGroup } from "../store/priorityQueue.js";
import { getJobsInGroup, popGroup } from "../store/groupedJobStore.js";
import {
    findAgentForGroup,
    assignAgent,
    pushJobToAgent,
    getAgentJobs,
    releaseAgent,
    registerAgent,
    isAgentFree,
    getFreeAgentsId
} from "../agents/agentManager.js";
import { updateJobStatus } from "../store/jobQueue.js";

//Simulated worker loop (can later be upgraded to actual agent messaging)
export function schedularLoop(){
    setInterval(()=>{
        
        if(isPriorityQueueEmpty()){
            console.log("Priority Queue empty");
            return;
        }

        const groupKey = peekNextGroup();

        if(!groupKey)return;

        const [orgId, appVersionId] = groupKey.split("|");
        const jobs = getJobsInGroup(orgId, appVersionId);

        if(jobs.length == 0)return;

        const existingAgent = findAgentForGroup(orgId, appVersionId);

        if(existingAgent){
            console.log(`Assigning ${jobs.length} jobs to existing agent`);
            jobs.forEach(job => {
                updateJobStatus(job.id, "running");
                pushJobToAgent(existingAgent, job);
            });
            popNextGroup(); //removing the added job from priority queue a.k.a. ready queue
        }else{
            const freeAgents = getFreeAgentsId();
            if(freeAgents.length > 0){
                const availableAgent = freeAgents[0];
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


    }, 1000) //Pool every one second
}

