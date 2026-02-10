import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ref, get } from 'firebase/database';
import { database } from '../config/firebase';
import '../styles/Auth.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { signInWithEmail } = useAuth();
    const navigate = useNavigate();

    const handleAdminLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            setError('');

            // Sign in with email/password
            const userCredential = await signInWithEmail(email, password);
            const user = userCredential;

            // Check if user is admin in database
            const adminRef = ref(database, `admins/${user.uid}`);
            const snapshot = await get(adminRef);

            if (!snapshot.exists() || snapshot.val().isAdmin !== true) {
                setError('Access denied. You do not have admin privileges.');
                // Sign out the user
                await auth.signOut();
                return;
            }

            // User is admin, redirect to admin panel
            navigate('/admin');
        } catch (error) {
            const errorMessage = error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found'
                ? 'Invalid email or password'
                : error.code === 'auth/too-many-requests'
                    ? 'Too many failed attempts. Please try again later.'
                    : error.message || 'Failed to sign in';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div style={{
                        fontSize: '3rem',
                        marginBottom: '1rem',
                        background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        🔐
                    </div>
                    <h1>Admin Access</h1>
                    <p>Sign in to manage Glaze369</p>
                </div>

                {error && (
                    <div className="error-message">
                        <i className="error-icon">⚠️</i>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleAdminLogin} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Admin Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="admin@glaze369.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-input-wrapper">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter admin password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Verifying...' : 'Access Admin Panel'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Not an admin?{' '}
                        <Link to="/login" className="auth-link">User Login</Link>
                    </p>
                </div>

                <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    background: 'rgba(255, 193, 7, 0.1)',
                    border: '1px solid rgba(255, 193, 7, 0.2)',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    textAlign: 'center'
                }}>
                    <strong style={{ color: '#ffc107', display: 'block', marginBottom: '0.5rem' }}>
                        Admin Access Only
                    </strong>
                    Contact the system administrator to request admin privileges.
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
