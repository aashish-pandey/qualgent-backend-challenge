# Qualgent Job Orchestrator

This repository contains the complete system for submitting and processing test jobs via CLI and a backend server that handles scheduling, grouping, and agent assignment.

## Folder Structure

- `cli/` — A command-line interface tool for submitting and checking the status of jobs.
- `backend/` — The job orchestration server with in-memory stores for jobs, agents, and queues.

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/qualgent-backend-challenge.git
cd qualgent-backend-challenge
```

---

## Backend Setup

### Prerequisites
- Node.js >= 18
- npm

### Steps

```bash
cd backend
npm install
npm start
```

The backend server should now be running on `http://localhost:3000`.

---

## CLI Setup

### Prerequisites
- Node.js >= 18
- npm

### Steps

```bash
cd cli
npm install
npm link   # This registers the CLI tool globally as `qgjob`
```

### Example Usage

```bash
qgjob submit --org-id=qualgent --app-version-id=xyz123 --test=tests/onboarding.spec.js
qgjob status --id=<job-id>
```

---

## Architecture Overview

1. **Job Submission**:
   - CLI sends the job data to the backend via REST API.

2. **Job Grouping & Queuing**:
   - The backend groups jobs based on `org_id` and `app_version_id`.
   - Grouped jobs are pushed into a priority queue if not already queued.

3. **Agent Assignment**:
   - Agents are registered and available to take jobs.
   - Jobs are dispatched based on agent availability and grouping.

4. **Job Tracking**:
   - The backend stores status for each job.
   - CLI queries this status using job ID.

---

## Development Notes

- The backend uses in-memory stores and queues which can be replaced by Redis for production-grade systems.
- Priority-based scheduling and grouping prevent starvation and enable fair resource utilization.
- Agents simulate execution but can be replaced by real workers in future iterations.

---


