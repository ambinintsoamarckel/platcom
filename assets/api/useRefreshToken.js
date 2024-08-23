// useRefreshToken.js
import React from 'react';
import axios from './axios';
import authHeader from './auth-header';

async function useRefreshToken() {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
        const response = await axios.post('https://127.0.0.1:9000/api/token/refresh', { refresh_token: user.refresh_token }, {
            headers: {
                'Content-Type': 'application/ld+json',
                
            }
        });
        const newToken = response['data']['token'];
        user.token = newToken;
        localStorage.setItem("user", JSON.stringify(user));
        const user2 = JSON.parse(localStorage.getItem("user"));

        return response;
    } catch (error) {
        console.error("Hook: Refresh failed!", error);
        throw error;
    }
}

export default useRefreshToken;
