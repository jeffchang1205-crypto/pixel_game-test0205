import axios from 'axios';

const API_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
});

// Helper to handle CORS/Redirects if necessary. 
// Note: fetch/axios to GAS Web App requires following redirects. 
// Usually GAS returns 302 to a temporary googleusercontent URL.
// Axios typically follows redirects in Node, but in Browser it depends.
// Also, GAS Web Apps need to be 'anyone, even anonymous' for CORS to work smoothly or use JSONP (which is old).
// With 'anyone' access, standard fetch/axios usually works if we use 'text/plain' or 'application/json' 
// BUT Google Apps Script `doPost` has quirks with CORS.
// Sending data as stringified JSON in the body often works best with `text/plain` content type to avoid preflight OPTIONS check which GAS fails.

export const fetchQuestions = async (count = 5) => {
    try {
        if (API_URL.includes("REPLACE")) {
            console.warn("Using MOCK questions for simulation");
            // ... (keep mock data if needed, or just return empty to fail)
        }

        const response = await fetch(`${API_URL}?op=getQuestions&count=${count}`, {
            method: 'GET',
            redirect: 'follow'
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'success') {
            return data.questions;
        }

        throw new Error(data.message || 'Failed to fetch questions');
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const submitResult = async (resultData) => {
    try {
        // For doPost to GAS, we often need to send as explicit string in body 
        // and use Content-Type: text/plain to avoid CORS preflight issues.
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({ op: 'submitResult', ...resultData }),
            // "Content-Type": "text/plain;charset=utf-8" // This avoids CORS preflight
        });

        // fetch returns opaque response for no-cors, but we want cors enabled on GAS.
        // If GAS is "Anyone", it usually returns CORS headers.

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Submit Error:', error);
        // Silent fail or mock success for demo if API not set
        if (!API_URL || API_URL.includes("REPLACE")) {
            console.warn("API URL not set, simulating success");
            return { status: "success" };
        }
        throw error;
    }
};
