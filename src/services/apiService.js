import { auth } from '../config/firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Get the current user's ID token
 * @returns {Promise<string>} Firebase ID token
 */
const getAuthToken = async () => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('No authenticated user');
    }
    return await user.getIdToken();
};

/**
 * Make an authenticated API request
 * @param {string} endpoint - API endpoint (e.g., '/user/profile')
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} Response data
 */
const apiRequest = async (endpoint, options = {}) => {
    try {
        const token = await getAuthToken();

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...options.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
};

/**
 * API service methods
 */
const apiService = {
    // Health check
    healthCheck: async () => {
        const response = await fetch(`${API_BASE_URL}/health`);
        return await response.json();
    },

    // User profile methods
    getUserProfile: async () => {
        return await apiRequest('/user/profile', {
            method: 'GET',
        });
    },

    updateUserProfile: async (displayName, photoURL) => {
        return await apiRequest('/user/profile', {
            method: 'PUT',
            body: JSON.stringify({ displayName, photoURL }),
        });
    },

    deleteUserAccount: async () => {
        return await apiRequest('/user/account', {
            method: 'DELETE',
        });
    },

    // Admin methods
    getAllUsers: async () => {
        return await apiRequest('/admin/users', {
            method: 'GET',
        });
    },

    setCustomClaims: async (uid, claims) => {
        return await apiRequest('/admin/set-claims', {
            method: 'POST',
            body: JSON.stringify({ uid, claims }),
        });
    },

    // Custom token
    createCustomToken: async (uid) => {
        const response = await fetch(`${API_BASE_URL}/auth/custom-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uid }),
        });
        return await response.json();
    },
};

export default apiService;
