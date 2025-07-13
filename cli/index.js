#!/usr/bin/env node
import {program} from "commander";
import submit from "./actions/submit.js";
import status from "./actions/status.js";

program
.name("qgjob")
.description("QualGent CLI for job submission and status tracking")
.version("1.0.0")

program
.command("submit")
.description("Submit a new test job")
.requiredOption("--org-id <org_id>", "Organization ID")
.requiredOption("--app-version-id <app_version_id>", "App Version ID")
.requiredOption("--test <test_path>", "Path to test file")
.action(submit);

program
.command("status")
.description("Check the status of a submitted job")
.requiredOption("--id <job_id>", "Job ID")
.action(status)

program.parse();