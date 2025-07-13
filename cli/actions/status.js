import {get} from "../utils/apiClient.js";

/**
 * Command handler for checking job status
 * @param {object} options - Parsed CLI options (e.g. --id)
 */
export default async function status(options){
    try{
        if(!options.id){
            console.error("Error: --id is required");
            process.exit(1);
        }
        const res = await get(`/status/${options.id}`);
        console.log(`status: ${res.status}`);
    }catch(err){
        console.error(err.message);
        process.exit(1);
    }
}