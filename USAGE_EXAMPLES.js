// Example: Using the Authentication Context in any component

import { useAuth } from '../context/AuthContext';

function MyComponent() {
    const { user, loading, signInWithGoogle, logout } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return (
            <div>
                <h2>Not logged in</h2>
                <button onClick={signInWithGoogle}>Sign in with Google</button>
            </div>
        );
    }

    return (
        <div>
            <h2>Welcome, {user.displayName || user.email}!</h2>
            <img src={user.photoURL} alt="Profile" />
            <button onClick={logout}>Logout</button>
        </div>
    );
}

// Example: Making authenticated API calls

import apiService from '../services/apiService';

async function getUserProfile() {
    try {
        const profile = await apiService.getUserProfile();
        console.log('User profile:', profile);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function updateProfile(displayName, photoURL) {
    try {
        const result = await apiService.updateUserProfile(displayName, photoURL);
        console.log('Profile updated:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Example: Protecting a component

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminPanel() {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <h1>Admin Panel</h1>
            {/* Admin content */}
        </div>
    );
}

// Example: Getting user token for custom API calls

import { auth } from '../config/firebase';

async function makeCustomApiCall() {
    const user = auth.currentUser;
    if (!user) {
        console.error('No user logged in');
        return;
    }

    const token = await user.getIdToken();

    const response = await fetch('http://localhost:5000/api/user/profile', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();
    console.log(data);
}

export {
    MyComponent,
    getUserProfile,
    updateProfile,
    AdminPanel,
    makeCustomApiCall
};
