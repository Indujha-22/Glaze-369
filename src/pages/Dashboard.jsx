import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../config/firebase';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('overview');
    const [userBookings, setUserBookings] = useState([]);
    const [userOrders, setUserOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch user's bookings and orders
    useEffect(() => {
        if (!user?.email) return;

        setLoading(true);
        
        // Fetch bookings for this user
        const bookingsRef = ref(database, 'bookings');
        const unsubBookings = onValue(bookingsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const allBookings = Object.entries(data).map(([key, val]) => ({ id: key, ...val }));
                // Filter by user email
                const filtered = allBookings.filter(b => 
                    b.email?.toLowerCase() === user.email.toLowerCase()
                );
                filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                setUserBookings(filtered);
            } else {
                setUserBookings([]);
            }
        });

        // Fetch orders for this user
        const ordersRef = ref(database, 'orders');
        const unsubOrders = onValue(ordersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const allOrders = Object.entries(data).map(([key, val]) => ({ id: key, ...val }));
                // Filter by user email
                const filtered = allOrders.filter(o => 
                    o.email?.toLowerCase() === user.email.toLowerCase()
                );
                filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                setUserOrders(filtered);
            } else {
                setUserOrders([]);
            }
            setLoading(false);
        });

        return () => {
            unsubBookings();
            unsubOrders();
        };
    }, [user]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Pending': '#f59e0b',
            'Confirmed': '#3b82f6',
            'In Progress': '#8b5cf6',
            'Completed': '#10b981',
            'Cancelled': '#ef4444',
            'Delivered': '#10b981',
            'Shipped': '#3b82f6',
            'Processing': '#f59e0b'
        };
        return colors[status] || '#6b7280';
    };

    // Overview Section (default cards)
    const renderOverview = () => (
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
                <span className="card-count">{userBookings.length} bookings</span>
                <button className="card-btn" onClick={() => setActiveSection('bookings')}>View Bookings</button>
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
                <span className="card-count">{userOrders.length} orders</span>
                <button className="card-btn" onClick={() => setActiveSection('history')}>View History</button>
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
                <button className="card-btn" onClick={() => setActiveSection('profile')}>Manage Profile</button>
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
                <button className="card-btn" onClick={() => navigate('/contact')}>Get Help</button>
            </div>
        </div>
    );

    // My Bookings Section
    const renderBookings = () => (
        <div className="section-content">
            <div className="section-header">
                <button className="back-btn" onClick={() => setActiveSection('overview')}>← Back</button>
                <h2>My Bookings</h2>
            </div>
            {loading ? (
                <div className="loading-state">Loading your bookings...</div>
            ) : userBookings.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">📅</span>
                    <h3>No Bookings Yet</h3>
                    <p>You haven't made any service bookings yet.</p>
                    <button className="card-btn" onClick={() => navigate('/booking')}>Book a Service</button>
                </div>
            ) : (
                <div className="bookings-list">
                    {userBookings.map((booking) => (
                        <div key={booking.id} className="booking-card">
                            <div className="booking-header">
                                <span className="booking-service">{booking.serviceType || 'Car Detailing'}</span>
                                <span 
                                    className="booking-status" 
                                    style={{ background: getStatusColor(booking.status) + '20', color: getStatusColor(booking.status) }}
                                >
                                    {booking.status || 'Pending'}
                                </span>
                            </div>
                            <div className="booking-details">
                                <div className="detail-row">
                                    <span className="detail-label">📅 Date</span>
                                    <span className="detail-value">{booking.preferredDate || booking.date || 'Not specified'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">⏰ Time</span>
                                    <span className="detail-value">{booking.preferredTime || booking.time || 'Not specified'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">🚗 Vehicle</span>
                                    <span className="detail-value">{booking.vehicleType || booking.carDetails || 'Not specified'}</span>
                                </div>
                                {booking.notes && (
                                    <div className="detail-row">
                                        <span className="detail-label">📝 Notes</span>
                                        <span className="detail-value">{booking.notes}</span>
                                    </div>
                                )}
                            </div>
                            <div className="booking-footer">
                                <span className="booking-date">Booked: {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-IN') : 'N/A'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    // Service History Section
    const renderHistory = () => (
        <div className="section-content">
            <div className="section-header">
                <button className="back-btn" onClick={() => setActiveSection('overview')}>← Back</button>
                <h2>Service History</h2>
            </div>
            {loading ? (
                <div className="loading-state">Loading your history...</div>
            ) : userOrders.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">📦</span>
                    <h3>No Order History</h3>
                    <p>You haven't placed any orders yet.</p>
                    <button className="card-btn" onClick={() => navigate('/products')}>Shop Products</button>
                </div>
            ) : (
                <div className="orders-list">
                    {userOrders.map((order) => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <span className="order-id">Order #{order.id.slice(-8).toUpperCase()}</span>
                                <span 
                                    className="order-status" 
                                    style={{ background: getStatusColor(order.status) + '20', color: getStatusColor(order.status) }}
                                >
                                    {order.status || 'Processing'}
                                </span>
                            </div>
                            <div className="order-items">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="order-item">
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-qty">×{item.quantity}</span>
                                        <span className="item-price">₹{item.price?.toLocaleString('en-IN')}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="order-footer">
                                <div className="order-meta">
                                    <span>📅 {order.date || (order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : 'N/A')}</span>
                                    <span>💳 {order.payment || 'COD'}</span>
                                </div>
                                <span className="order-total">Total: ₹{Number(order.total || 0).toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    // Profile Settings Section
    const renderProfile = () => (
        <div className="section-content">
            <div className="section-header">
                <button className="back-btn" onClick={() => setActiveSection('overview')}>← Back</button>
                <h2>Profile Settings</h2>
            </div>
            <div className="profile-section">
                <div className="profile-card">
                    <div className="profile-avatar">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="Profile" />
                        ) : (
                            <div className="avatar-placeholder large">
                                {user?.email?.[0]?.toUpperCase() || 'U'}
                            </div>
                        )}
                    </div>
                    <div className="profile-details">
                        <div className="profile-field">
                            <label>Display Name</label>
                            <span>{user?.displayName || 'Not set'}</span>
                        </div>
                        <div className="profile-field">
                            <label>Email Address</label>
                            <span>{user?.email}</span>
                        </div>
                        <div className="profile-field">
                            <label>Email Verified</label>
                            <span className={user?.emailVerified ? 'verified' : 'not-verified'}>
                                {user?.emailVerified ? '✓ Verified' : '✗ Not Verified'}
                            </span>
                        </div>
                        <div className="profile-field">
                            <label>Sign-in Provider</label>
                            <span>{user?.providerData?.[0]?.providerId === 'google.com' ? '🔵 Google' : '📧 Email/Password'}</span>
                        </div>
                        <div className="profile-field">
                            <label>Account Created</label>
                            <span>{user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}</span>
                        </div>
                        <div className="profile-field">
                            <label>Last Sign-in</label>
                            <span>{user?.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span>
                        </div>
                    </div>
                </div>
                <div className="profile-actions">
                    <button className="action-btn secondary" onClick={() => navigate('/forgot-password')}>
                        🔐 Change Password
                    </button>
                    <button className="action-btn danger" onClick={handleLogout}>
                        🚪 Sign Out
                    </button>
                </div>
            </div>
        </div>
    );

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
                {activeSection === 'overview' && (
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
                )}

                {activeSection === 'overview' && renderOverview()}
                {activeSection === 'bookings' && renderBookings()}
                {activeSection === 'history' && renderHistory()}
                {activeSection === 'profile' && renderProfile()}
            </div>
        </div>
    );
};

export default Dashboard;
