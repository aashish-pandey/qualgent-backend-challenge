import {post} from '../utils/apiClient.js';

/**
 * Submit a new test job to backend
 * @param {object} options - CLI options passed from commander/yargs
 */
export default async function handleSubmit(options){
    try{
        const {orgId, appVersionId, test} = options;

        if(!orgId || !appVersionId || !test){
            console.error("Missing required options: --org-id, --app-version-id, --test");
            process.exit(1);
        }

        const data = {
            org_id: orgId,
            app_version_id: appVersionId,
            test
        }
        const res = await post("/submit-job", data);
        console.log("Job submitted successfully");
        console.log("Job ID: ", res.job.id);
        console.log("status: ", res.job.status);
    }catch(err){
        console.error('Submission failed:', err.message);
    }
}