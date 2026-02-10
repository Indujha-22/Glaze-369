import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>Welcome to Glaze369</h1>
                    <button onClick={handleLogout} className="logout-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Logout
                    </button>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="user-card">
                    <div className="user-avatar">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="Profile" />
                        ) : (
                            <div className="avatar-placeholder">
                                {user?.email?.[0]?.toUpperCase() || 'U'}
                            </div>
                        )}
                    </div>

                    <div className="user-info">
                        <h2>{user?.displayName || 'User'}</h2>
                        <p className="user-email">{user?.email}</p>
                        <div className="user-meta">
                            <span className="badge">
                                {user?.emailVerified ? '✓ Verified' : 'Not Verified'}
                            </span>
                            <span className="badge">
                                Provider: {user?.providerData?.[0]?.providerId?.split('.')[0] || 'Email'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <div className="card-icon" style={{ background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h3>My Bookings</h3>
                        <p>View and manage your car detailing appointments</p>
                        <button className="card-btn">View Bookings</button>
                    </div>

                    <div className="dashboard-card">
                        <div className="card-icon" style={{ background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <h3>Service History</h3>
                        <p>Track your past detailing services and invoices</p>
                        <button className="card-btn">View History</button>
                    </div>

                    <div className="dashboard-card">
                        <div className="card-icon" style={{ background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        </div>
                        <h3>Profile Settings</h3>
                        <p>Update your account information and preferences</p>
                        <button className="card-btn">Manage Profile</button>
                    </div>

                    <div className="dashboard-card">
                        <div className="card-icon" style={{ background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <circle cx="12" cy="8" r="0.5" fill="currentColor" stroke="currentColor" />
                            </svg>
                        </div>
                        <h3>Help & Support</h3>
                        <p>Get assistance and contact our support team</p>
                        <button className="card-btn">Get Help</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
