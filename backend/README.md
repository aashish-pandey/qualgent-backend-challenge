# Backend - Job Scheduling System

This backend powers the job submission and execution system for the Qualgent assignment. It handles job grouping, prioritization, and dynamic assignment to agents using an in-memory data store.

---

## Getting Started

### 1. Move into the backend directory

Make sure you're in the `backend/` folder (inside your master repo):

```bash
cd backend
```

### 2. Install dependencies

Ensure Node.js (v18 or higher) is installed, then run:

```bash
npm install
```

### 3. Run the server

Start the development server:

```bash
npm run dev
```

This will launch the backend server on `http://localhost:3000`.

> The scheduler will start automatically and a couple of agents (`agent-1`, `agent-2`) will be registered for testing.

---

## API Endpoints

### `POST /submit-job`

Submit a new job.

**Payload:**

```json
{
  "org_id": "qualgent",
  "app_version_id": "xyz123",
  "test": "tests/onboarding.spec.js",
  "priority": 2,
  "target": "mobile"
}
```

**Returns:**
- `job` object with ID and metadata.

---

### `GET /status/:id`

Returns the current status of the job (`pending`, `running`, or `done`).

---

### `GET /job/:id`

Fetch full job details by ID (for debugging or testing).

---

## System Overview

This backend implements a lightweight job scheduler that coordinates incoming job requests and assigns them to available agents.

### Job Flow (from CLI to agent):

1. **Submission:**
   - CLI submits a job to `/submit-job`.
   - The job is stored and grouped by `org_id + app_version_id`.

2. **Grouping:**
   - Similar jobs (same org & app version) are grouped together.
   - Only one group key per type is added to the ready queue.

3. **Prioritization:**
   - Groups are enqueued in a min-priority queue.
   - A higher-priority job ensures its group moves up the queue.

4. **Agent Assignment:**
   - A scheduler loop runs every few seconds.
   - If a free agent is available, it pulls the top group and assigns all jobs from that group to the agent.
   - If another job of the same group arrives later, it is pushed to the same agent’s internal queue.

5. **Job Execution:**
   - Jobs are simulated with a delay (e.g., 3 seconds).
   - Once finished, the agent is marked free and ready for new assignments.

---

## Design Notes

- Built using Express and in-memory Maps.
- Designed for statelessness and easy migration to Redis later.
- Supports fair scheduling and avoids starvation using group-level priority.
- Modular storage structure (`jobStore`, `groupedJobStore`, `priorityQueue`, `agentManager`).

---

## Future Improvements

- Replace in-memory stores with Redis.
- Add persistent agent communication via WebSocket or polling.
- Introduce rate limits and retry policies.
