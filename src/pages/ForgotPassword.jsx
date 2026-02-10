import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';
import '../styles/Auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!email) {
            setError('Please enter your email address');
            return;
        }

        try {
            setLoading(true);
            setError('');
            await sendPasswordResetEmail(auth, email);
            setSuccess(true);
        } catch (error) {
            const errorMessage = error.code === 'auth/user-not-found'
                ? 'No account found with this email'
                : error.code === 'auth/invalid-email'
                    ? 'Invalid email address'
                    : error.message || 'Failed to send reset email';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Reset Password</h1>
                    <p>Enter your email to receive a password reset link</p>
                </div>

                {error && (
                    <div className="error-message">
                        <i className="error-icon">⚠️</i>
                        <span>{error}</span>
                    </div>
                )}

                {success ? (
                    <div className="success-message">
                        <div className="success-icon">✓</div>
                        <h3>Check your email</h3>
                        <p>
                            We've sent a password reset link to <strong>{email}</strong>.
                            Please check your inbox and follow the instructions.
                        </p>
                        <Link to="/login" className="submit-btn" style={{ textAlign: 'center', display: 'block', marginTop: '1.5rem' }}>
                            Back to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleResetPassword} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>

                        <div className="auth-footer" style={{ marginTop: '1rem', paddingTop: '1rem' }}>
                            <p>
                                Remember your password?{' '}
                                <Link to="/login" className="auth-link">Sign in</Link>
                            </p>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
