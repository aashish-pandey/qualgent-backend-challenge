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

/**
 * ===========================
 * Job Management Endpoints
 * ===========================
 */

/**
 * @route POST /submit-job
 * @desc Submit a new test job to the backend scheduler
 * @access Public
 */
app.post("/submit-job", (req, res) => {
    try {
        const job = submitJob(req.body);
        res.status(201).json({ message: "Job Submitted", job });
    } catch (err) {
        console.error("Job submission failed:", err.message);
        res.status(400).json({ error: err.message || "unknown error" });
    }
});

/**
 * @route GET /job/:id
 * @desc Retrieve a full job object by its ID
 * @access Public (for debugging/testing)
 */
app.get("/job/:id", (req, res) => {
    const job = getJobById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
});

/**
 * @route GET /status/:id
 * @desc Get only the status of a job by its ID
 * @access Public
 */
app.get("/status/:id", (req, res) => {
    console.log("From status");
    console.log(req.params.id);
    const job = getJobById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json({ status: job.status });
});

/**
 * ===========================
 * Server + Scheduler Start
 * ===========================
 */

app.listen(PORT, () => {
    if (process.env.NODE_ENV === "development") {
        console.log(`Server running at http://localhost:${PORT}`);
    }
});

// Start scheduling loop and register initial agents
schedularLoop();
registerAgent("agent-1");
registerAgent("agent-2");
console.log("Registered agents: agent-1, agent-2");
