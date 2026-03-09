import { createContext, useContext, useEffect, useState } from 'react';
import {
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from 'firebase/auth';
import { ref, set, get, serverTimestamp } from 'firebase/database';
import { auth, googleProvider, database } from '../config/firebase';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Sign in with Google
    const signInWithGoogle = async () => {
        try {
            setError(null);
            const result = await signInWithPopup(auth, googleProvider);
            return result.user;
        } catch (error) {
            console.error('Error signing in with Google:', error);
            setError(error.message);
            throw error;
        }
    };

    // Sign in with email and password
    const signInWithEmail = async (email, password) => {
        try {
            setError(null);
            const result = await signInWithEmailAndPassword(auth, email, password);
            return result.user;
        } catch (error) {
            console.error('Error signing in with email:', error);
            setError(error.message);
            throw error;
        }
    };

    // Sign up with email and password
    const signUpWithEmail = async (email, password) => {
        try {
            setError(null);
            const result = await createUserWithEmailAndPassword(auth, email, password);
            return result.user;
        } catch (error) {
            console.error('Error signing up with email:', error);
            setError(error.message);
            throw error;
        }
    };

    // Sign out
    const logout = async () => {
        try {
            setError(null);
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
            setError(error.message);
            throw error;
        }
    };

    // Monitor authentication state & save user profile to Realtime Database
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                try {
                    const userRef = ref(database, `users/${currentUser.uid}`);
                    const snapshot = await get(userRef);
                    const existing = snapshot.val() || {};
                    await set(userRef, {
                        ...existing,
                        uid: currentUser.uid,
                        email: currentUser.email || '',
                        displayName: currentUser.displayName || existing.displayName || '',
                        photoURL: currentUser.photoURL || existing.photoURL || '',
                        provider: currentUser.providerData?.[0]?.providerId || 'email',
                        emailVerified: currentUser.emailVerified || false,
                        lastLogin: Date.now(),
                        createdAt: existing.createdAt || Date.now(),
                    });
                } catch (err) {
                    console.error('Error saving user profile to DB:', err);
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const value = {
        user,
        loading,
        error,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
