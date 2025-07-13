import axios from "axios";
import "dotenv/config";

const BASE_URL = process.env.BACKEND_URL || "http://localhost:3000";

const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    headers:{
        "Content-Type": "application/json"
    }
});

/**
 * POST request
 * @param {string} endpoint - API route like "/submit"
 * @param {object} data = Payload to send
 */
export async function post(endpoint, data){
    try{
        const response = await apiClient.post(endpoint, data);
        return response.data;
    }catch(err){
        throw formatError(err);
    }
}

/**
 * GET request
 * @param {string} endpoint - API route like "/status/:id"
 */
export async function get(endpoint){
    try{
        const response = await apiClient.get(endpoint);
        return response.data;
    }catch(err){
        throw formatError(err);
    }
}

/**
 * Format error for user friendly CLI output
 */
function formatError(err){
    if(err.response){
        return new Error(`Error ${err.response.status}: ${err.response.data.error}`)
    }
    if(err.request){
        return new Error(`No response from backend. Is it running at ${BASE_URL}?`);
    }
    return new Error(`{err.message}`);
}
