# QualGent Backend Coding Challenge

## Structure
/backend
    This repo implements a modular backend for a test orchestration system. It supports job submission, grouping, agent assignment, and retry logic.

    See `backend/notes.txt` for architecture decisions and design rationale.
## Design Summary
    CLI submits job

    Backend stores it in a global job store

    Grouping: Jobs with the same (org_id, app_version_id) are grouped into a "family"

    Priority Queue: Group is added to a priority queue once per key

    New jobs with the same key are merged into the existing group

    Agent Assignment:

    Idle agents pick a group from the queue

    If a group is already running on an agent and a new job for that group arrives,
    it’s assigned to the same agent (rather than triggering another install/setup)