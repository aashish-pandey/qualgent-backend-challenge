import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config';

import {
    submitJob,
    getJobById,
    getAllJobs,
    getPendingJobs,
    updateJobStatus,
    incrementRetry,
} from './store/jobQueue.js';

import { schedularLoop } from './schedular/schedular.js';
import { addJobToGroup, getGroupKey, hasGroup } from './store/groupedJobStore.js';
import { addGroupToPriorityQueue, hasGroupInQueue } from './store/priorityQueue.js';
import { registerAgent } from './agents/agentManager.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

//routing logics starts from here

// POST /submit-job
app.post("/submit-job", (req, res)=>{
    try{
        const job = submitJob(req.body);

        res.status(201).json({message: "Job Submitted", job});
    }catch(err){
        console.error("Job submitted failed:", err.message);
        res.status(400).json({error:err.message || "unknown error"});
    }
    
});

//GET /job/id (testing purpose)
app.get("/job/:id", (req, res)=>{
    const job = getJobById(req.params.id);
    
    if(!job)return res.status(404).json({error: "Job not found"});

    res.json(job);
});


//GET /status/:id
app.get("/status/:id", (req, res)=>{
    console.log("From status");
    console.log(req.params.id);
    const job = getJobById(req.params.id);
    if(!job)return res.status(404).json({error: "Job not found"});
    res.json({status: job.status});
});


//routing logic ends here

app.listen(PORT, ()=>{
    if(process.env.NODE_ENV === "development"){
        console.log(`server running at http://localhost:${PORT}`);
    }

})

//Start schedular loop and register initial agents
schedularLoop();

registerAgent("agent-1");
registerAgent("agent-2");
console.log("Registered agents: agent-1, agent-2");