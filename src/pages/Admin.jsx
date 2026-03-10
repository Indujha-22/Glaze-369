import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ref, get, onValue, update, remove, push, set } from 'firebase/database';
import { database } from '../config/firebase';
import { products as localProducts, categories as localCategories } from '../data/products';
import { services as localServices } from '../data/services';
import { galleryItems as localGallery, galleryCategories } from '../data/gallery';
import './Admin.css';

/* ═══════════════════════════════════════════════════
   ADMIN LOGIN (Firebase Auth)
   ═══════════════════════════════════════════════════ */
function AdminLogin({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState('admin');
    const { signInWithEmail, signInWithGoogle, logout } = useAuth();
    const navigate = useNavigate();

    // Hardcoded admin credentials
    const ADMIN_EMAIL = 'adminb4u@gmail.com';
    const ADMIN_PASSWORD = 'admin123';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please enter your email and password');
            return;
        }
        setLoading(true);
        setError('');

        if (role === 'user') {
            // User login → redirect to user dashboard
            try {
                await signInWithEmail(email, password);
                navigate('/dashboard');
            } catch (err) {
                const msg =
                    err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential'
                        ? 'Invalid email or password'
                        : err.code === 'auth/too-many-requests'
                            ? 'Too many failed attempts. Please try again later.'
                            : err.message || 'Failed to sign in';
                setError(msg);
            } finally {
                setLoading(false);
            }
            return;
        }

        // Admin login flow
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            onLogin({ email: ADMIN_EMAIL, uid: 'local-admin' });
            setLoading(false);
            return;
        }

        try {
            const user = await signInWithEmail(email, password);
            const adminRef = ref(database, `admins/${user.uid}`);
            const snapshot = await get(adminRef);
            if (!snapshot.exists() || snapshot.val().isAdmin !== true) {
                setError('Access denied. You do not have admin privileges.');
                await logout();
                return;
            }
            onLogin(user);
        } catch (err) {
            const msg =
                err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential'
                    ? 'Invalid email or password'
                    : err.code === 'auth/too-many-requests'
                        ? 'Too many failed attempts. Please try again later.'
                        : err.message || 'Failed to sign in';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            if (role === 'user') {
                await signInWithGoogle();
                navigate('/dashboard');
            } else {
                const user = await signInWithGoogle();
                const adminRef = ref(database, `admins/${user.uid}`);
                const snapshot = await get(adminRef);
                if (!snapshot.exists() || snapshot.val().isAdmin !== true) {
                    setError('Access denied. You do not have admin privileges.');
                    await logout();
                    return;
                }
                onLogin(user);
            }
        } catch (err) {
            if (err.code !== 'auth/popup-closed-by-user') {
                setError(err.message || 'Failed to sign in with Google');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login">
            <div className="login-card">
                <div className="login-logo">
                    <span className="logo-text">Glaze</span>
                    <span className="logo-accent">369</span>
                </div>
                <div className="admin-shield">{role === 'admin' ? '🔐' : '👤'}</div>
                <h2>{role === 'admin' ? 'Admin Panel' : 'User Login'}</h2>
                <p className="login-subtitle">{role === 'admin' ? 'Sign in with your admin credentials' : 'Sign in to your account'}</p>

                {/* Role Toggle */}
                <div className="role-toggle">
                    <button
                        type="button"
                        className={`role-btn ${role === 'admin' ? 'active' : ''}`}
                        onClick={() => { setRole('admin'); setError(''); }}
                    >
                        🔐 Admin
                    </button>
                    <button
                        type="button"
                        className={`role-btn ${role === 'user' ? 'active' : ''}`}
                        onClick={() => { setRole('user'); setError(''); }}
                    >
                        👤 User
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div className="login-error">⚠️ {error}</div>}
                    <div className="form-group">
                        <label className="form-label">{role === 'admin' ? 'Admin Email' : 'Email'}</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={role === 'admin' ? 'admin@glaze369.com' : 'you@example.com'}
                            disabled={loading}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                disabled={loading}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle-admin"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
                        {loading ? 'Verifying...' : role === 'admin' ? '🔒 Sign In as Admin' : '🔓 Sign In as User'}
                    </button>
                </form>

                <div className="login-divider"><span>or</span></div>

                <button
                    type="button"
                    className="btn btn-google"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                >
                    <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>
                    {loading ? 'Signing in...' : `Sign in with Google as ${role === 'admin' ? 'Admin' : 'User'}`}
                </button>

                <p className="login-hint">
                    {role === 'admin' ? 'Admin accounts must be pre-registered in Firebase.' : 'Don\'t have an account? Contact admin or sign up.'}
                </p>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   DASHBOARD (Dynamic Analytics from Firebase)
   ═══════════════════════════════════════════════════ */
function Dashboard() {
    const [bookings, setBookings] = useState([]);
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [registeredUsers, setRegisteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let loadCount = 0;
        const checkLoaded = () => { loadCount++; if (loadCount >= 3) setLoading(false); };

        const unsub1 = onValue(ref(database, 'bookings'), snap => {
            const data = snap.val();
            if (data) setBookings(Object.entries(data).map(([k, v]) => ({ firebaseKey: k, ...v })).reverse());
            else setBookings([]);
            checkLoaded();
        });
        const unsub2 = onValue(ref(database, 'orders'), snap => {
            const data = snap.val();
            if (data) setOrders(Object.entries(data).map(([k, v]) => ({ firebaseKey: k, ...v })).reverse());
            else setOrders([]);
            checkLoaded();
        });
        const unsub3 = onValue(ref(database, 'users'), snap => {
            const data = snap.val();
            if (data) {
                const list = Object.entries(data).map(([uid, v]) => ({ uid, ...v }));
                list.sort((a, b) => (b.lastLogin || 0) - (a.lastLogin || 0));
                setRegisteredUsers(list);
            } else {
                setRegisteredUsers([]);
            }
            checkLoaded();
        });
        return () => { unsub1(); unsub2(); unsub3(); };
    }, []);

    // Derive unique customers from bookings + orders
    useEffect(() => {
        const map = {};
        bookings.forEach(b => {
            const key = b.mobile || b.name;
            if (!key) return;
            if (!map[key]) map[key] = { name: b.name, mobile: b.mobile, email: '', bookings: 0, orders: 0, totalSpent: 0 };
            map[key].bookings += 1;
        });
        orders.forEach(o => {
            const key = o.mobile || o.customer;
            if (!key) return;
            if (!map[key]) map[key] = { name: o.customer, mobile: o.mobile, email: o.email || '', bookings: 0, orders: 0, totalSpent: 0 };
            map[key].orders += 1;
            map[key].totalSpent += Number(o.total) || 0;
            if (o.email) map[key].email = o.email;
        });
        setCustomers(Object.values(map));
    }, [bookings, orders]);

    // --- Analytics computations ---
    const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
    const confirmedBookings = bookings.filter(b => b.status === 'Confirmed').length;
    const completedBookings = bookings.filter(b => b.status === 'Completed').length;
    const inProgressBookings = bookings.filter(b => b.status === 'In Progress').length;
    const cancelledBookings = bookings.filter(b => b.status === 'Cancelled').length;

    const onlineRevenue = orders.filter(o => o.payment === 'Razorpay').reduce((s, o) => s + (Number(o.total) || 0), 0);
    const codRevenue = orders.filter(o => o.payment === 'COD' || o.payment === 'Cash on Delivery').reduce((s, o) => s + (Number(o.total) || 0), 0);
    const totalRevenue = orders.reduce((s, o) => s + (Number(o.total) || 0), 0);
    const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

    // Monthly revenue (last 6 months)
    const getMonthlyRevenue = () => {
        const months = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const label = d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
            const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const revenue = orders
                .filter(o => (o.date || '').startsWith(monthStr) || (o.createdAt && new Date(o.createdAt).toISOString().startsWith(monthStr)))
                .reduce((s, o) => s + (Number(o.total) || 0), 0);
            const bookingCount = bookings
                .filter(b => (b.preferredDate || b.date || '').startsWith(monthStr) || (b.createdAt && new Date(b.createdAt).toISOString().startsWith(monthStr)))
                .length;
            months.push({ label, revenue, bookings: bookingCount });
        }
        return months;
    };
    const monthlyData = getMonthlyRevenue();
    const maxMonthlyRevenue = Math.max(...monthlyData.map(m => m.revenue), 1);

    // Top 5 customers by spending
    const topCustomers = [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);

    // Popular services from bookings
    const serviceCounts = {};
    bookings.forEach(b => {
        const svc = b.serviceType;
        if (svc) serviceCounts[svc] = (serviceCounts[svc] || 0) + 1;
    });
    const popularServices = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const maxServiceCount = popularServices.length > 0 ? popularServices[0][1] : 1;

    const stats = [
        { label: 'Total Bookings', value: bookings.length, icon: '📅', color: '#3b82f6' },
        { label: 'Pending Bookings', value: pendingBookings, icon: '⏳', color: '#f59e0b' },
        { label: 'Product Orders', value: orders.length, icon: '📦', color: '#8b5cf6' },
        { label: 'Online Revenue', value: onlineRevenue ? `₹${onlineRevenue.toLocaleString('en-IN')}` : '₹0', icon: '💰', color: '#10b981' },
        { label: 'Total Revenue', value: totalRevenue ? `₹${totalRevenue.toLocaleString('en-IN')}` : '₹0', icon: '💵', color: '#06b6d4' },
        { label: 'Total Customers', value: customers.length, icon: '👥', color: '#ec4899' },
        { label: 'Registered Users', value: registeredUsers.length, icon: '🔐', color: '#6366f1' },
        { label: 'Avg Order Value', value: avgOrderValue ? `₹${avgOrderValue.toLocaleString('en-IN')}` : '₹0', icon: '📈', color: '#f97316' },
    ];

    const recentBookings = bookings.slice(0, 5);
    const recentOrders = orders.slice(0, 5);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.4)' }}>Loading dashboard...</div>;
    }

    return (
        <div className="admin-dashboard">
            <div className="dash-header">
                <h2>Dashboard</h2>
                <span className="dash-date">📅 {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="stats-grid">
                {stats.map((stat, i) => (
                    <div key={i} className="stat-card" style={{ '--accent': stat.color }}>
                        <div className="stat-icon-wrap" style={{ background: `${stat.color}20`, color: stat.color }}>{stat.icon}</div>
                        <div className="stat-content">
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Analytics Charts Section ── */}
            <div className="dash-grid">
                {/* Monthly Revenue Chart */}
                <div className="dashboard-section">
                    <div className="section-head"><h3>📊 Monthly Revenue</h3></div>
                    <div className="chart-container">
                        <div className="bar-chart">
                            {monthlyData.map((m, i) => (
                                <div key={i} className="bar-group">
                                    <div className="bar-value">₹{m.revenue > 0 ? (m.revenue >= 1000 ? `${(m.revenue / 1000).toFixed(1)}K` : m.revenue) : '0'}</div>
                                    <div className="bar-track">
                                        <div className="bar-fill" style={{ height: `${(m.revenue / maxMonthlyRevenue) * 100}%`, background: 'linear-gradient(180deg, #10b981, #059669)' }} />
                                    </div>
                                    <div className="bar-label">{m.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Booking Status Breakdown */}
                <div className="dashboard-section">
                    <div className="section-head"><h3>📋 Booking Status</h3></div>
                    <div className="status-breakdown">
                        {[
                            { label: 'Pending', count: pendingBookings, color: '#f59e0b' },
                            { label: 'Confirmed', count: confirmedBookings, color: '#3b82f6' },
                            { label: 'In Progress', count: inProgressBookings, color: '#8b5cf6' },
                            { label: 'Completed', count: completedBookings, color: '#10b981' },
                            { label: 'Cancelled', count: cancelledBookings, color: '#ef4444' },
                        ].map((s, i) => (
                            <div key={i} className="status-row">
                                <div className="status-row-label">
                                    <span className="status-dot" style={{ background: s.color }} />
                                    <span>{s.label}</span>
                                </div>
                                <div className="status-row-bar">
                                    <div className="status-bar-track">
                                        <div className="status-bar-fill" style={{ width: `${bookings.length > 0 ? (s.count / bookings.length) * 100 : 0}%`, background: s.color }} />
                                    </div>
                                    <span className="status-row-count">{s.count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Revenue Split + Popular Services ── */}
            <div className="dash-grid">
                {/* Revenue Split */}
                <div className="dashboard-section">
                    <div className="section-head"><h3>💳 Revenue Split</h3></div>
                    <div className="revenue-split">
                        <div className="rev-item">
                            <span className="rev-label">Online (Razorpay)</span>
                            <span className="rev-value" style={{ color: '#10b981' }}>₹{onlineRevenue.toLocaleString('en-IN')}</span>
                            <div className="rev-bar"><div className="rev-bar-fill" style={{ width: `${totalRevenue > 0 ? (onlineRevenue / totalRevenue) * 100 : 0}%`, background: '#10b981' }} /></div>
                        </div>
                        <div className="rev-item">
                            <span className="rev-label">Cash on Delivery</span>
                            <span className="rev-value" style={{ color: '#f59e0b' }}>₹{codRevenue.toLocaleString('en-IN')}</span>
                            <div className="rev-bar"><div className="rev-bar-fill" style={{ width: `${totalRevenue > 0 ? (codRevenue / totalRevenue) * 100 : 0}%`, background: '#f59e0b' }} /></div>
                        </div>
                        <div className="rev-total">
                            <span>Total Revenue</span>
                            <span className="text-accent" style={{ fontSize: '1.4rem', fontWeight: 700 }}>₹{totalRevenue.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>

                {/* Popular Services */}
                <div className="dashboard-section">
                    <div className="section-head"><h3>🔥 Popular Services</h3></div>
                    <div className="popular-services">
                        {popularServices.length === 0 && <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '1rem' }}>No service data yet</p>}
                        {popularServices.map(([name, count], i) => (
                            <div key={i} className="service-pop-row">
                                <div className="service-pop-info">
                                    <span className="service-pop-rank">#{i + 1}</span>
                                    <span className="service-pop-name">{name}</span>
                                </div>
                                <div className="service-pop-bar-wrap">
                                    <div className="service-pop-bar" style={{ width: `${(count / maxServiceCount) * 100}%` }} />
                                    <span className="service-pop-count">{count} bookings</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Top Customers ── */}
            <div className="dash-grid">
                <div className="dashboard-section">
                    <div className="section-head"><h3>🏆 Top Customers</h3><Link to="/admin/customers" className="view-all">View All →</Link></div>
                    <div className="data-table">
                        <table>
                            <thead><tr><th>#</th><th>Customer</th><th>Mobile</th><th>Bookings</th><th>Orders</th><th>Total Spent</th></tr></thead>
                            <tbody>
                                {topCustomers.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No customer data yet</td></tr>}
                                {topCustomers.map((c, i) => (
                                    <tr key={i}>
                                        <td><span className="top-rank">{i + 1}</span></td>
                                        <td><strong>{c.name}</strong></td>
                                        <td>{c.mobile || '—'}</td>
                                        <td>{c.bookings}</td>
                                        <td>{c.orders}</td>
                                        <td className="text-accent">₹{c.totalSpent.toLocaleString('en-IN')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ── Registered Users ── */}
            <div className="dash-grid">
                <div className="dashboard-section full-width">
                    <div className="section-head"><h3>🔐 Registered Users</h3><span className="dash-date">{registeredUsers.length} users</span></div>
                    <div className="data-table">
                        <table>
                            <thead><tr><th>#</th><th>User</th><th>Email</th><th>Provider</th><th>Verified</th><th>Created</th><th>Last Login</th></tr></thead>
                            <tbody>
                                {registeredUsers.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No registered users yet</td></tr>}
                                {registeredUsers.map((u, i) => (
                                    <tr key={u.uid}>
                                        <td>{i + 1}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {u.photoURL ? <img src={u.photoURL} alt="" style={{ width: 28, height: 28, borderRadius: '50%' }} /> : <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,193,7,0.15)', color: '#ffc107', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>{(u.email || '?')[0].toUpperCase()}</span>}
                                                <strong>{u.displayName || u.email?.split('@')[0] || 'User'}</strong>
                                            </div>
                                        </td>
                                        <td>{u.email}</td>
                                        <td><span className={`method-badge ${u.provider === 'google.com' ? 'google' : 'email'}`}>{u.provider === 'google.com' ? '🔵 Google' : '📧 Email'}</span></td>
                                        <td><span className={`status-badge ${u.emailVerified ? 'completed' : 'pending'}`}>{u.emailVerified ? '✓ Verified' : 'Pending'}</span></td>
                                        <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                                        <td>{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ── Recent Bookings & Orders ── */}
            <div className="dash-grid">
                <div className="dashboard-section">
                    <div className="section-head"><h3>Recent Bookings</h3><Link to="/admin/bookings" className="view-all">View All →</Link></div>
                    <div className="data-table">
                        <table>
                            <thead><tr><th>Customer</th><th>Service</th><th>Date</th><th>Status</th></tr></thead>
                            <tbody>
                                {recentBookings.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No bookings yet</td></tr>}
                                {recentBookings.map((b, i) => (
                                    <tr key={i}>
                                        <td>{b.name}</td><td>{b.serviceType}</td><td>{b.date || b.preferredDate}</td>
                                        <td><span className={`status-badge ${(b.status || 'pending').toLowerCase().replace(' ', '-')}`}>{b.status || 'Pending'}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="dashboard-section">
                    <div className="section-head"><h3>Recent Orders</h3><Link to="/admin/orders" className="view-all">View All →</Link></div>
                    <div className="data-table">
                        <table>
                            <thead><tr><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th></tr></thead>
                            <tbody>
                                {recentOrders.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No orders yet</td></tr>}
                                {recentOrders.map((o, i) => (
                                    <tr key={i}>
                                        <td>{o.customer}</td>
                                        <td className="text-accent">₹{Number(o.total).toLocaleString('en-IN')}</td>
                                        <td>{o.payment}</td>
                                        <td><span className={`status-badge ${(o.status || 'pending').toLowerCase()}`}>{o.status || 'Pending'}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   BOOKINGS MANAGEMENT
   ═══════════════════════════════════════════════════ */
function BookingsManagement() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All Status');
    const [search, setSearch] = useState('');

    useEffect(() => {
        const unsub = onValue(ref(database, 'bookings'), snap => {
            const data = snap.val();
            if (data) {
                const list = Object.entries(data).map(([k, v]) => ({ firebaseKey: k, ...v })).reverse();
                setBookings(list);
            } else {
                setBookings([]);
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const filtered = bookings.filter(b => {
        const matchStatus = filter === 'All Status' || b.status === filter;
        const matchSearch = (b.name || '').toLowerCase().includes(search.toLowerCase()) || (b.mobile || '').includes(search);
        return matchStatus && matchSearch;
    });

    const updateStatus = async (firebaseKey, newStatus) => {
        await update(ref(database, `bookings/${firebaseKey}`), { status: newStatus });
    };

    const deleteBooking = async (firebaseKey) => {
        if (window.confirm('Delete this booking?')) {
            await remove(ref(database, `bookings/${firebaseKey}`));
        }
    };

    return (
        <div className="admin-bookings">
            <div className="page-header"><h2>Booking Management</h2><span className="dash-date">{bookings.length} total</span></div>
            <div className="filters-row">
                <input type="text" className="form-input search-input" placeholder="Search by name or mobile..." value={search} onChange={e => setSearch(e.target.value)} />
                <select className="form-select filter-select" value={filter} onChange={e => setFilter(e.target.value)}>
                    {['All Status', 'Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                </select>
            </div>
            {loading ? <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.4)' }}>Loading...</div> : (
                <div className="data-table">
                    <table>
                        <thead><tr><th>Customer</th><th>Mobile</th><th>Vehicle</th><th>Service</th><th>Date & Time</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                            {filtered.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No bookings found</td></tr>}
                            {filtered.map(b => (
                                <tr key={b.firebaseKey}>
                                    <td><strong>{b.name}</strong></td>
                                    <td>{b.mobile}</td>
                                    <td>{b.vehicleType}</td>
                                    <td>{b.serviceType}</td>
                                    <td>{b.preferredDate || b.date}<br /><small>{b.preferredTime || b.time}</small></td>
                                    <td>
                                        <select className="status-select" value={b.status || 'Pending'} onChange={e => updateStatus(b.firebaseKey, e.target.value)}>
                                            {['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn" title="WhatsApp" onClick={() => window.open(`https://wa.me/91${b.mobile}`)}>💬</button>
                                            <button className="action-btn delete" title="Delete" onClick={() => deleteBooking(b.firebaseKey)}>🗑</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div className="table-footer">{filtered.length} of {bookings.length} bookings</div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   ORDERS MANAGEMENT
   ═══════════════════════════════════════════════════ */
function OrdersManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');

    useEffect(() => {
        const unsub = onValue(ref(database, 'orders'), snap => {
            const data = snap.val();
            if (data) {
                const list = Object.entries(data).map(([k, v]) => ({ firebaseKey: k, ...v })).reverse();
                setOrders(list);
            } else {
                setOrders([]);
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const filtered = orders.filter(o => {
        const matchStatus = filter === 'All' || o.status === filter;
        const matchSearch = (o.customer || '').toLowerCase().includes(search.toLowerCase()) || (o.orderId || '').toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    const updateStatus = async (firebaseKey, status) => {
        await update(ref(database, `orders/${firebaseKey}`), { status });
    };

    const deleteOrder = async (firebaseKey) => {
        if (window.confirm('Delete this order?')) {
            await remove(ref(database, `orders/${firebaseKey}`));
        }
    };

    return (
        <div className="admin-orders">
            <div className="page-header"><h2>Product Orders</h2><span className="dash-date">{orders.length} total</span></div>
            <div className="filters-row">
                <input type="text" className="form-input search-input" placeholder="Search by customer or order ID..." value={search} onChange={e => setSearch(e.target.value)} />
                <select className="form-select filter-select" value={filter} onChange={e => setFilter(e.target.value)}>
                    {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                </select>
            </div>
            {loading ? <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.4)' }}>Loading...</div> : (
                <div className="data-table">
                    <table>
                        <thead><tr><th>Order ID</th><th>Customer</th><th>Mobile</th><th>Items</th><th>Total</th><th>Payment</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                            {filtered.length === 0 && <tr><td colSpan={9} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No orders found</td></tr>}
                            {filtered.map(o => (
                                <tr key={o.firebaseKey}>
                                    <td><code>{o.orderId?.slice(-8) || '—'}</code></td>
                                    <td><strong>{o.customer}</strong><br /><small>{o.email}</small></td>
                                    <td>{o.mobile}</td>
                                    <td>{o.itemCount || (Array.isArray(o.items) ? o.items.length : '—')} items</td>
                                    <td className="text-accent">₹{Number(o.total).toLocaleString('en-IN')}</td>
                                    <td><span className={`payment-badge ${(o.payment || '').toLowerCase()}`}>{o.payment}</span>{o.paymentId && o.paymentId !== '—' && <><br /><code className="pay-id">{o.paymentId}</code></>}</td>
                                    <td>{o.date}</td>
                                    <td>
                                        <select className="status-select" value={o.status || 'Pending'} onChange={e => updateStatus(o.firebaseKey, e.target.value)}>
                                            {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn" title="WhatsApp" onClick={() => window.open(`https://wa.me/91${o.mobile}`)}>💬</button>
                                            <button className="action-btn delete" title="Delete" onClick={() => deleteOrder(o.firebaseKey)}>🗑</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div className="table-footer">{filtered.length} of {orders.length} orders</div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   PAYMENTS (RAZORPAY)
   ═══════════════════════════════════════════════════ */
function PaymentsManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onValue(ref(database, 'orders'), snap => {
            const data = snap.val();
            if (data) {
                const list = Object.entries(data)
                    .map(([k, v]) => ({ firebaseKey: k, ...v }))
                    .filter(o => o.payment === 'Razorpay')
                    .reverse();
                setOrders(list);
            } else {
                setOrders([]);
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const totalRevenue = orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + (Number(o.total) || 0), 0);

    return (
        <div className="admin-payments">
            <div className="page-header"><h2>💳 Payments (Razorpay)</h2></div>
            <div className="payment-stats">
                <div className="pstat"><span className="pstat-label">Total Revenue</span><span className="pstat-value text-accent">₹{totalRevenue.toLocaleString('en-IN')}</span></div>
                <div className="pstat"><span className="pstat-label">Transactions</span><span className="pstat-value" style={{ color: '#10b981' }}>{orders.length}</span></div>
                <div className="pstat"><span className="pstat-label">Delivered</span><span className="pstat-value" style={{ color: '#3b82f6' }}>{orders.filter(o => o.status === 'Delivered').length}</span></div>
                <div className="pstat"><span className="pstat-label">Cancelled</span><span className="pstat-value" style={{ color: '#ef4444' }}>{orders.filter(o => o.status === 'Cancelled').length}</span></div>
            </div>
            {loading ? <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.4)' }}>Loading...</div> : (
                <div className="data-table">
                    <table>
                        <thead><tr><th>Payment ID</th><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                        <tbody>
                            {orders.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No Razorpay payments yet</td></tr>}
                            {orders.map(o => (
                                <tr key={o.firebaseKey}>
                                    <td><code>{o.paymentId || '—'}</code></td>
                                    <td><code>{o.orderId?.slice(-10) || '—'}</code></td>
                                    <td>{o.customer}<br /><small>{o.email}</small></td>
                                    <td className="text-accent">₹{Number(o.total).toLocaleString('en-IN')}</td>
                                    <td><span className={`status-badge ${(o.status || 'pending').toLowerCase()}`}>{o.status}</span></td>
                                    <td>{o.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   CUSTOMERS
   ═══════════════════════════════════════════════════ */
function CustomersManagement() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('totalSpent');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [bookingsRaw, setBookingsRaw] = useState([]);
    const [ordersRaw, setOrdersRaw] = useState([]);

    // Real-time listeners for bookings and orders
    useEffect(() => {
        const unsub1 = onValue(ref(database, 'bookings'), snap => {
            const data = snap.val();
            setBookingsRaw(data ? Object.entries(data).map(([k, v]) => ({ firebaseKey: k, ...v })) : []);
        });
        const unsub2 = onValue(ref(database, 'orders'), snap => {
            const data = snap.val();
            setOrdersRaw(data ? Object.entries(data).map(([k, v]) => ({ firebaseKey: k, ...v })) : []);
        });
        return () => { unsub1(); unsub2(); };
    }, []);

    // Derive customers whenever bookings/orders change
    useEffect(() => {
        const map = {};

        bookingsRaw.forEach(b => {
            const key = b.mobile || b.name;
            if (!key) return;
            if (!map[key]) map[key] = { name: b.name, mobile: b.mobile, email: '', bookings: 0, orders: 0, totalSpent: 0, lastActivity: '', services: [] };
            map[key].bookings += 1;
            if (b.serviceType && !map[key].services.includes(b.serviceType)) map[key].services.push(b.serviceType);
            const bDate = b.preferredDate || b.date || b.createdAt || '';
            if (bDate > (map[key].lastActivity || '')) map[key].lastActivity = bDate;
        });

        ordersRaw.forEach(o => {
            const key = o.mobile || o.customer;
            if (!key) return;
            if (!map[key]) map[key] = { name: o.customer, mobile: o.mobile, email: o.email || '', bookings: 0, orders: 0, totalSpent: 0, lastActivity: '', services: [] };
            map[key].orders += 1;
            map[key].totalSpent += Number(o.total) || 0;
            if (o.email) map[key].email = o.email;
            if (o.customer && !map[key].name) map[key].name = o.customer;
            const oDate = o.date || o.createdAt || '';
            if (oDate > (map[key].lastActivity || '')) map[key].lastActivity = oDate;
        });

        setCustomers(Object.values(map));
        setLoading(false);
    }, [bookingsRaw, ordersRaw]);

    // Customer stats
    const totalSpentAll = customers.reduce((s, c) => s + c.totalSpent, 0);
    const avgSpent = customers.length > 0 ? Math.round(totalSpentAll / customers.length) : 0;
    const repeatCustomers = customers.filter(c => (c.bookings + c.orders) > 1).length;

    const filtered = customers.filter(c =>
        (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (c.mobile || '').includes(search) ||
        (c.email || '').toLowerCase().includes(search.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === 'totalSpent') return b.totalSpent - a.totalSpent;
        if (sortBy === 'bookings') return b.bookings - a.bookings;
        if (sortBy === 'orders') return b.orders - a.orders;
        if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
        if (sortBy === 'recent') return (b.lastActivity || '').localeCompare(a.lastActivity || '');
        return 0;
    });

    // Get customer detail: their bookings and orders
    const getCustomerBookings = (c) => bookingsRaw.filter(b => (b.mobile || b.name) === (c.mobile || c.name));
    const getCustomerOrders = (c) => ordersRaw.filter(o => (o.mobile || o.customer) === (c.mobile || c.name));

    return (
        <div className="admin-customers">
            <div className="page-header"><h2>👥 Customers</h2><span className="dash-date">{customers.length} total</span></div>

            {/* Customer Stats */}
            <div className="customer-stats-row">
                <div className="cstat"><span className="cstat-value">{customers.length}</span><span className="cstat-label">Total Customers</span></div>
                <div className="cstat"><span className="cstat-value">{repeatCustomers}</span><span className="cstat-label">Repeat Customers</span></div>
                <div className="cstat"><span className="cstat-value">₹{avgSpent.toLocaleString('en-IN')}</span><span className="cstat-label">Avg Spend</span></div>
                <div className="cstat"><span className="cstat-value">₹{totalSpentAll.toLocaleString('en-IN')}</span><span className="cstat-label">Total Revenue</span></div>
            </div>

            <div className="filters-row">
                <input type="text" className="form-input search-input" placeholder="Search by name, mobile or email..." value={search} onChange={e => setSearch(e.target.value)} />
                <select className="form-select filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <option value="totalSpent">Sort: Highest Spend</option>
                    <option value="bookings">Sort: Most Bookings</option>
                    <option value="orders">Sort: Most Orders</option>
                    <option value="recent">Sort: Recent Activity</option>
                    <option value="name">Sort: Name A-Z</option>
                </select>
            </div>
            {loading ? <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.4)' }}>Loading...</div> : (
                <div className="data-table">
                    <table>
                        <thead><tr><th>Name</th><th>Mobile</th><th>Email</th><th>Bookings</th><th>Orders</th><th>Total Spent</th><th>Services Used</th><th>Actions</th></tr></thead>
                        <tbody>
                            {sorted.length === 0 && <tr><td colSpan={8} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No customers yet</td></tr>}
                            {sorted.map((c, i) => (
                                <tr key={i} style={{ cursor: 'pointer' }} onClick={() => setSelectedCustomer(selectedCustomer === i ? null : i)}>
                                    <td><strong>{c.name}</strong></td>
                                    <td>{c.mobile}</td>
                                    <td>{c.email || '—'}</td>
                                    <td>{c.bookings}</td>
                                    <td>{c.orders}</td>
                                    <td className="text-accent">₹{c.totalSpent.toLocaleString('en-IN')}</td>
                                    <td>{c.services.length > 0 ? c.services.slice(0, 2).join(', ') + (c.services.length > 2 ? ` +${c.services.length - 2}` : '') : '—'}</td>
                                    <td>
                                        <div className="action-buttons">
                                            {c.mobile && <button className="action-btn" title="WhatsApp" onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/91${c.mobile}`); }}>💬</button>}
                                            <button className="action-btn" title="Details" onClick={(e) => { e.stopPropagation(); setSelectedCustomer(selectedCustomer === i ? null : i); }}>👁</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Customer Detail Panel */}
            {selectedCustomer !== null && sorted[selectedCustomer] && (
                <div className="customer-detail-panel">
                    <div className="customer-detail-header">
                        <h3>👤 {sorted[selectedCustomer].name}</h3>
                        <button className="action-btn" onClick={() => setSelectedCustomer(null)}>✕</button>
                    </div>
                    <div className="customer-detail-info">
                        <p><strong>Mobile:</strong> {sorted[selectedCustomer].mobile || '—'}</p>
                        <p><strong>Email:</strong> {sorted[selectedCustomer].email || '—'}</p>
                        <p><strong>Total Spent:</strong> <span className="text-accent">₹{sorted[selectedCustomer].totalSpent.toLocaleString('en-IN')}</span></p>
                        <p><strong>Services:</strong> {sorted[selectedCustomer].services.join(', ') || '—'}</p>
                    </div>
                    {getCustomerBookings(sorted[selectedCustomer]).length > 0 && (
                        <div className="customer-detail-section">
                            <h4>📅 Bookings ({getCustomerBookings(sorted[selectedCustomer]).length})</h4>
                            <div className="data-table">
                                <table>
                                    <thead><tr><th>Service</th><th>Vehicle</th><th>Date</th><th>Status</th></tr></thead>
                                    <tbody>
                                        {getCustomerBookings(sorted[selectedCustomer]).map((b, j) => (
                                            <tr key={j}>
                                                <td>{b.serviceType}</td>
                                                <td>{b.vehicleType || '—'}</td>
                                                <td>{b.preferredDate || b.date}</td>
                                                <td><span className={`status-badge ${(b.status || 'pending').toLowerCase().replace(' ', '-')}`}>{b.status || 'Pending'}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    {getCustomerOrders(sorted[selectedCustomer]).length > 0 && (
                        <div className="customer-detail-section">
                            <h4>📦 Orders ({getCustomerOrders(sorted[selectedCustomer]).length})</h4>
                            <div className="data-table">
                                <table>
                                    <thead><tr><th>Order ID</th><th>Total</th><th>Payment</th><th>Date</th><th>Status</th></tr></thead>
                                    <tbody>
                                        {getCustomerOrders(sorted[selectedCustomer]).map((o, j) => (
                                            <tr key={j}>
                                                <td><code>{o.orderId?.slice(-8) || '—'}</code></td>
                                                <td className="text-accent">₹{Number(o.total).toLocaleString('en-IN')}</td>
                                                <td>{o.payment}</td>
                                                <td>{o.date}</td>
                                                <td><span className={`status-badge ${(o.status || 'pending').toLowerCase()}`}>{o.status || 'Pending'}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
            <div className="table-footer">{sorted.length} of {customers.length} customers</div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   SERVICES MANAGEMENT (CRUD)
   ═══════════════════════════════════════════════════ */
const EMPTY_SERVICE = { name: '', shortDescription: '', fullDescription: '', duration: '', price: '', priceRange: '', image: '', features: '', status: 'Active' };

function ServicesManagement() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ ...EMPTY_SERVICE });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const unsub = onValue(ref(database, 'services'), snap => {
            const data = snap.val();
            if (data) {
                const list = Object.entries(data).map(([k, v]) => ({ firebaseKey: k, ...v }));
                setServices(list);
            } else {
                // First time — seed from local data
                const seedRef = ref(database, 'services');
                localServices.forEach(s => {
                    push(seedRef, {
                        name: s.name,
                        shortDescription: s.shortDescription || '',
                        fullDescription: s.fullDescription || '',
                        duration: s.duration,
                        price: s.price,
                        priceRange: s.priceRange,
                        image: s.image || '',
                        features: (s.features || []).join(', '),
                        status: 'Active',
                    });
                });
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const openAdd = () => { setEditing(null); setForm({ ...EMPTY_SERVICE }); setShowForm(true); };
    const openEdit = (service) => {
        setEditing(service.firebaseKey);
        setForm({
            name: service.name || '',
            shortDescription: service.shortDescription || '',
            fullDescription: service.fullDescription || '',
            duration: service.duration || '',
            price: service.price || '',
            priceRange: service.priceRange || '',
            image: service.image || '',
            features: Array.isArray(service.features) ? service.features.join(', ') : (service.features || ''),
            status: service.status || 'Active',
        });
        setShowForm(true);
    };
    const closeForm = () => { setShowForm(false); setEditing(null); setForm({ ...EMPTY_SERVICE }); };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.name || !form.duration || !form.price) return;
        setSaving(true);
        const serviceData = {
            name: form.name,
            shortDescription: form.shortDescription,
            fullDescription: form.fullDescription,
            duration: form.duration,
            price: form.price,
            priceRange: form.priceRange || form.price,
            image: form.image,
            features: form.features,
            status: form.status,
        };
        if (editing) {
            await update(ref(database, `services/${editing}`), serviceData);
        } else {
            await push(ref(database, 'services'), serviceData);
        }
        setSaving(false);
        closeForm();
    };

    const handleDelete = async (firebaseKey) => {
        if (window.confirm('Delete this service?')) {
            await remove(ref(database, `services/${firebaseKey}`));
        }
    };

    const toggleStatus = async (firebaseKey, currentStatus) => {
        await update(ref(database, `services/${firebaseKey}`), { status: currentStatus === 'Active' ? 'Inactive' : 'Active' });
    };

    return (
        <div className="admin-services">
            <div className="page-header"><h2>🔧 Services</h2><button className="btn btn-primary" onClick={openAdd}>+ Add Service</button></div>

            {/* Add/Edit Modal */}
            {showForm && (
                <div className="product-modal-overlay" onClick={closeForm}>
                    <div className="product-modal" onClick={e => e.stopPropagation()}>
                        <div className="product-modal-header">
                            <h3>{editing ? 'Edit Service' : 'Add New Service'}</h3>
                            <button className="action-btn" onClick={closeForm}>✕</button>
                        </div>
                        <form onSubmit={handleSave} className="product-form">
                            <div className="settings-grid">
                                <div className="form-group full-width">
                                    <label className="form-label">Service Name *</label>
                                    <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                                </div>
                                <div className="form-group full-width">
                                    <label className="form-label">Short Description</label>
                                    <input className="form-input" value={form.shortDescription} onChange={e => setForm(p => ({ ...p, shortDescription: e.target.value }))} />
                                </div>
                                <div className="form-group full-width">
                                    <label className="form-label">Full Description</label>
                                    <textarea className="form-input" rows={3} value={form.fullDescription} onChange={e => setForm(p => ({ ...p, fullDescription: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Duration *</label>
                                    <input className="form-input" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} placeholder="e.g. 2-3 hours" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Price *</label>
                                    <input className="form-input" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="e.g. ₹1,500" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Price Range</label>
                                    <input className="form-input" value={form.priceRange} onChange={e => setForm(p => ({ ...p, priceRange: e.target.value }))} placeholder="e.g. ₹1,500 - ₹2,500" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Image URL</label>
                                    <input className="form-input" value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} placeholder="https://..." />
                                </div>
                                <div className="form-group full-width">
                                    <label className="form-label">Features (comma-separated)</label>
                                    <textarea className="form-input" rows={2} value={form.features} onChange={e => setForm(p => ({ ...p, features: e.target.value }))} placeholder="Feature 1, Feature 2, Feature 3" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Status</label>
                                    <select className="form-input" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="product-form-actions">
                                <button type="button" className="btn btn-outline" onClick={closeForm}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update Service' : 'Add Service'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {loading ? <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.4)' }}>Loading...</div> : (
                <div className="services-grid">
                    {services.length === 0 && <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '2rem' }}>No services yet. Click "+ Add Service" to create one.</p>}
                    {services.map(s => (
                        <div key={s.firebaseKey} className="service-admin-card">
                            <div className="service-admin-header">
                                <h3>{s.name}</h3>
                                <span
                                    className={`status-badge ${(s.status || 'active').toLowerCase()}`}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => toggleStatus(s.firebaseKey, s.status)}
                                    title="Click to toggle status"
                                >{s.status || 'Active'}</span>
                            </div>
                            <div className="service-admin-details">
                                <p><strong>Duration:</strong> {s.duration}</p>
                                <p><strong>Price:</strong> {s.priceRange || s.price}</p>
                                {s.shortDescription && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.5rem' }}>{s.shortDescription}</p>}
                            </div>
                            <div className="service-admin-actions">
                                <button className="btn btn-outline btn-sm" onClick={() => openEdit(s)}>Edit</button>
                                <button className="btn btn-outline btn-sm" onClick={() => handleDelete(s.firebaseKey)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   PRODUCTS MANAGEMENT (CRUD)
   ═══════════════════════════════════════════════════ */
const EMPTY_PRODUCT = { name: '', description: '', price: '', originalPrice: '', category: '', image: '', inStock: true, featured: false };

function ProductsManagement() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('All');
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null); // firebaseKey or null
    const [form, setForm] = useState({ ...EMPTY_PRODUCT });
    const [saving, setSaving] = useState(false);

    // Seed local products on first load if Firebase /products is empty
    useEffect(() => {
        const unsub = onValue(ref(database, 'products'), snap => {
            const data = snap.val();
            if (data) {
                const list = Object.entries(data).map(([k, v]) => ({ firebaseKey: k, ...v }));
                setProducts(list);
            } else {
                // First time — seed from local data
                const seedRef = ref(database, 'products');
                localProducts.forEach(p => {
                    push(seedRef, { ...p });
                });
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

    const filtered = products.filter(p => {
        const matchCat = catFilter === 'All' || p.category === catFilter;
        const matchSearch = (p.name || '').toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    const openAdd = () => { setEditing(null); setForm({ ...EMPTY_PRODUCT }); setShowForm(true); };
    const openEdit = (product) => {
        setEditing(product.firebaseKey);
        setForm({
            name: product.name || '',
            description: product.description || '',
            price: product.price || '',
            originalPrice: product.originalPrice || '',
            category: product.category || '',
            image: product.image || '',
            inStock: product.inStock !== false,
            featured: product.featured || false,
        });
        setShowForm(true);
    };
    const closeForm = () => { setShowForm(false); setEditing(null); setForm({ ...EMPTY_PRODUCT }); };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.name || !form.price || !form.category) return;
        setSaving(true);
        const productData = {
            name: form.name,
            description: form.description,
            price: Number(form.price),
            originalPrice: Number(form.originalPrice) || Number(form.price),
            category: form.category,
            image: form.image,
            inStock: form.inStock,
            featured: form.featured,
            rating: 0,
            reviews: 0,
        };

        if (editing) {
            await update(ref(database, `products/${editing}`), productData);
        } else {
            await push(ref(database, 'products'), productData);
        }
        setSaving(false);
        closeForm();
    };

    const handleDelete = async (firebaseKey) => {
        if (window.confirm('Delete this product?')) {
            await remove(ref(database, `products/${firebaseKey}`));
        }
    };

    const toggleStock = async (firebaseKey, current) => {
        await update(ref(database, `products/${firebaseKey}`), { inStock: !current });
    };

    const toggleFeatured = async (firebaseKey, current) => {
        await update(ref(database, `products/${firebaseKey}`), { featured: !current });
    };

    return (
        <div className="admin-products">
            <div className="page-header">
                <h2>🛍 Products</h2>
                <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
            </div>

            {/* Filters */}
            <div className="filters-row">
                <input type="text" className="form-input search-input" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
                <select className="form-select filter-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
                    {categories.map(c => <option key={c}>{c}</option>)}
                </select>
                <span className="dash-date">{products.length} products</span>
            </div>

            {/* Add/Edit Modal */}
            {showForm && (
                <div className="product-modal-overlay" onClick={closeForm}>
                    <div className="product-modal" onClick={e => e.stopPropagation()}>
                        <div className="product-modal-header">
                            <h3>{editing ? 'Edit Product' : 'Add New Product'}</h3>
                            <button className="action-btn" onClick={closeForm}>✕</button>
                        </div>
                        <form onSubmit={handleSave} className="product-form">
                            <div className="settings-grid">
                                <div className="form-group full-width">
                                    <label className="form-label">Product Name *</label>
                                    <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                                </div>
                                <div className="form-group full-width">
                                    <label className="form-label">Description</label>
                                    <textarea className="form-input" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Price (₹) *</label>
                                    <input type="number" className="form-input" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} required min="0" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Original Price (₹)</label>
                                    <input type="number" className="form-input" value={form.originalPrice} onChange={e => setForm(p => ({ ...p, originalPrice: e.target.value }))} min="0" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Category *</label>
                                    <input className="form-input" list="cat-list" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} required />
                                    <datalist id="cat-list">
                                        {['Ceramic Coating', 'Polishing', 'Cleaning', 'Accessories', 'Wax & Sealant'].map(c => <option key={c} value={c} />)}
                                    </datalist>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Image URL</label>
                                    <input className="form-input" value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} placeholder="https://..." />
                                </div>
                                <div className="form-group">
                                    <div className="toggle-row"><label className="toggle"><input type="checkbox" checked={form.inStock} onChange={e => setForm(p => ({ ...p, inStock: e.target.checked }))} /><span className="toggle-slider"></span></label><span>In Stock</span></div>
                                </div>
                                <div className="form-group">
                                    <div className="toggle-row"><label className="toggle"><input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} /><span className="toggle-slider"></span></label><span>Featured</span></div>
                                </div>
                            </div>
                            <div className="product-form-actions">
                                <button type="button" className="btn btn-outline" onClick={closeForm}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Products Table */}
            {loading ? <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.4)' }}>Loading...</div> : (
                <div className="data-table">
                    <table>
                        <thead>
                            <tr><th>Image</th><th>Product Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Featured</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No products found</td></tr>}
                            {filtered.map(p => (
                                <tr key={p.firebaseKey}>
                                    <td>
                                        <div className="product-thumb">
                                            {p.image ? <img src={p.image} alt={p.name} /> : <span className="no-img">📷</span>}
                                        </div>
                                    </td>
                                    <td>
                                        <strong>{p.name}</strong>
                                        {p.description && <br />}
                                        {p.description && <small style={{ color: 'rgba(255,255,255,0.35)' }}>{p.description.slice(0, 60)}...</small>}
                                    </td>
                                    <td><span className="method-badge">{p.category}</span></td>
                                    <td>
                                        <span className="text-accent">₹{Number(p.price).toLocaleString('en-IN')}</span>
                                        {p.originalPrice > p.price && <><br /><small style={{ textDecoration: 'line-through', color: 'rgba(255,255,255,0.3)' }}>₹{Number(p.originalPrice).toLocaleString('en-IN')}</small></>}
                                    </td>
                                    <td>
                                        <button className={`status-badge ${p.inStock !== false ? 'active' : 'cancelled'}`} onClick={() => toggleStock(p.firebaseKey, p.inStock !== false)} style={{ cursor: 'pointer', border: 'none' }}>
                                            {p.inStock !== false ? 'In Stock' : 'Out of Stock'}
                                        </button>
                                    </td>
                                    <td>
                                        <button className={`status-badge ${p.featured ? 'confirmed' : 'pending'}`} onClick={() => toggleFeatured(p.firebaseKey, p.featured)} style={{ cursor: 'pointer', border: 'none' }}>
                                            {p.featured ? '⭐ Yes' : 'No'}
                                        </button>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn" title="Edit" onClick={() => openEdit(p)}>✏️</button>
                                            <button className="action-btn delete" title="Delete" onClick={() => handleDelete(p.firebaseKey)}>🗑</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div className="table-footer">{filtered.length} of {products.length} products</div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   GALLERY MANAGEMENT
   ═══════════════════════════════════════════════════ */
const EMPTY_GALLERY_ITEM = { title: '', category: '', image: '', description: '' };

function GalleryManagement() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ ...EMPTY_GALLERY_ITEM });
    const [saving, setSaving] = useState(false);
    const [catFilter, setCatFilter] = useState('All');

    useEffect(() => {
        const unsub = onValue(ref(database, 'gallery'), snap => {
            const data = snap.val();
            if (data) {
                const list = Object.entries(data).map(([k, v]) => ({ firebaseKey: k, ...v }));
                setItems(list);
            } else {
                // First time — seed from local data
                const seedRef = ref(database, 'gallery');
                localGallery.forEach(g => {
                    push(seedRef, {
                        title: g.title,
                        category: g.category || '',
                        image: g.image,
                        description: g.description || '',
                    });
                });
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const categories = ['All', ...new Set(items.map(i => i.category).filter(Boolean))];

    const filtered = items.filter(i => catFilter === 'All' || i.category === catFilter);

    const openAdd = () => { setEditing(null); setForm({ ...EMPTY_GALLERY_ITEM }); setShowForm(true); };
    const openEdit = (item) => {
        setEditing(item.firebaseKey);
        setForm({
            title: item.title || '',
            category: item.category || '',
            image: item.image || '',
            description: item.description || '',
        });
        setShowForm(true);
    };
    const closeForm = () => { setShowForm(false); setEditing(null); setForm({ ...EMPTY_GALLERY_ITEM }); };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.image) return;
        setSaving(true);
        const itemData = {
            title: form.title,
            category: form.category,
            image: form.image,
            description: form.description,
        };
        if (editing) {
            await update(ref(database, `gallery/${editing}`), itemData);
        } else {
            await push(ref(database, 'gallery'), itemData);
        }
        setSaving(false);
        closeForm();
    };

    const handleDelete = async (firebaseKey) => {
        if (window.confirm('Delete this gallery image?')) {
            await remove(ref(database, `gallery/${firebaseKey}`));
        }
    };

    return (
        <div className="admin-gallery">
            <div className="page-header"><h2>🖼 Gallery</h2><button className="btn btn-primary" onClick={openAdd}>+ Upload New</button></div>

            {/* Filters */}
            <div className="filters-row">
                <select className="form-select filter-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
                    {categories.map(c => <option key={c}>{c}</option>)}
                </select>
                <span className="dash-date">{items.length} images</span>
            </div>

            {/* Add/Edit Modal */}
            {showForm && (
                <div className="product-modal-overlay" onClick={closeForm}>
                    <div className="product-modal" onClick={e => e.stopPropagation()}>
                        <div className="product-modal-header">
                            <h3>{editing ? 'Edit Gallery Image' : 'Add Gallery Image'}</h3>
                            <button className="action-btn" onClick={closeForm}>✕</button>
                        </div>
                        <form onSubmit={handleSave} className="product-form">
                            <div className="settings-grid">
                                <div className="form-group full-width">
                                    <label className="form-label">Image URL *</label>
                                    <input className="form-input" value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} placeholder="https://..." required />
                                </div>
                                <div className="form-group full-width">
                                    <label className="form-label">Title</label>
                                    <input className="form-input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <input className="form-input" list="gallery-cat-list" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} />
                                    <datalist id="gallery-cat-list">
                                        {galleryCategories.filter(c => c !== 'All').map(c => <option key={c} value={c} />)}
                                    </datalist>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <input className="form-input" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                                </div>
                            </div>
                            {form.image && (
                                <div style={{ margin: '1rem 0', textAlign: 'center' }}>
                                    <img src={form.image} alt="Preview" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, objectFit: 'cover' }} />
                                </div>
                            )}
                            <div className="product-form-actions">
                                <button type="button" className="btn btn-outline" onClick={closeForm}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update Image' : 'Add Image'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {loading ? <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.4)' }}>Loading...</div> : (
                <div className="gallery-admin-grid">
                    {filtered.length === 0 && <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '2rem' }}>No images found.</p>}
                    {filtered.map(item => (
                        <div key={item.firebaseKey} className="gallery-admin-item">
                            <img src={item.image} alt={item.title || 'Gallery'} />
                            {item.title && <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}><strong>{item.title}</strong>{item.category && <span className="method-badge" style={{ marginLeft: '0.5rem', fontSize: '0.7rem' }}>{item.category}</span>}</div>}
                            <div className="gallery-admin-overlay">
                                <button className="action-btn" onClick={() => openEdit(item)}>✏️</button>
                                <button className="action-btn delete" onClick={() => handleDelete(item.firebaseKey)}>🗑</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   SETTINGS
   ═══════════════════════════════════════════════════ */
function SettingsPage() {
    const [settings, setSettings] = useState({
        siteName: 'Glaze369 Car Detailing',
        phone: '+91 98765 43210',
        email: 'info@glaze369.com',
        address: '123 Main Road, Tiruppur, Tamil Nadu 641602',
        razorpayKey: 'rzp_test_SPOrR8y66LGYgr',
        razorpayEnabled: true,
        codEnabled: true,
        notifyWhatsApp: true,
        notifyEmail: true,
    });
    const [saved, setSaved] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="admin-settings">
            <div className="page-header"><h2>⚙️ Settings</h2></div>
            <form onSubmit={handleSave}>
                <div className="settings-section">
                    <h3>Business Information</h3>
                    <div className="settings-grid">
                        <div className="form-group"><label className="form-label">Business Name</label><input className="form-input" value={settings.siteName} onChange={e => setSettings(p => ({ ...p, siteName: e.target.value }))} /></div>
                        <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={settings.phone} onChange={e => setSettings(p => ({ ...p, phone: e.target.value }))} /></div>
                        <div className="form-group"><label className="form-label">Email</label><input className="form-input" value={settings.email} onChange={e => setSettings(p => ({ ...p, email: e.target.value }))} /></div>
                        <div className="form-group full-width"><label className="form-label">Address</label><input className="form-input" value={settings.address} onChange={e => setSettings(p => ({ ...p, address: e.target.value }))} /></div>
                    </div>
                </div>
                <div className="settings-section">
                    <h3>Payment Configuration</h3>
                    <div className="settings-grid">
                        <div className="form-group"><label className="form-label">Razorpay Key ID</label><input className="form-input" value={settings.razorpayKey} onChange={e => setSettings(p => ({ ...p, razorpayKey: e.target.value }))} /></div>
                        <div className="form-group">
                            <label className="form-label">Payment Methods</label>
                            <div className="toggle-row"><label className="toggle"><input type="checkbox" checked={settings.razorpayEnabled} onChange={e => setSettings(p => ({ ...p, razorpayEnabled: e.target.checked }))} /><span className="toggle-slider"></span></label><span>Razorpay (Online)</span></div>
                            <div className="toggle-row"><label className="toggle"><input type="checkbox" checked={settings.codEnabled} onChange={e => setSettings(p => ({ ...p, codEnabled: e.target.checked }))} /><span className="toggle-slider"></span></label><span>Cash on Delivery</span></div>
                        </div>
                    </div>
                </div>
                <div className="settings-section">
                    <h3>Notifications</h3>
                    <div className="toggle-row"><label className="toggle"><input type="checkbox" checked={settings.notifyWhatsApp} onChange={e => setSettings(p => ({ ...p, notifyWhatsApp: e.target.checked }))} /><span className="toggle-slider"></span></label><span>WhatsApp Notifications</span></div>
                    <div className="toggle-row"><label className="toggle"><input type="checkbox" checked={settings.notifyEmail} onChange={e => setSettings(p => ({ ...p, notifyEmail: e.target.checked }))} /><span className="toggle-slider"></span></label><span>Email Notifications</span></div>
                </div>
                <button type="submit" className="btn btn-primary">{saved ? '✅ Saved!' : 'Save Settings'}</button>
            </form>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   MAIN ADMIN LAYOUT
   ═══════════════════════════════════════════════════ */
function Admin() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [adminUser, setAdminUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const { logout } = useAuth();

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: '📊' },
        { path: '/admin/bookings', label: 'Bookings', icon: '📅' },
        { path: '/admin/orders', label: 'Orders', icon: '📦' },
        { path: '/admin/products', label: 'Products', icon: '🛍' },
        { path: '/admin/payments', label: 'Payments', icon: '💳' },
        { path: '/admin/customers', label: 'Customers', icon: '👥' },
        { path: '/admin/services', label: 'Services', icon: '🔧' },
        { path: '/admin/gallery', label: 'Gallery', icon: '🖼' },
        { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
    ];

    const handleLogin = (user) => {
        setAdminUser(user);
        setIsLoggedIn(true);
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error('Logout error:', err);
        }
        setIsLoggedIn(false);
        setAdminUser(null);
    };

    if (!isLoggedIn) {
        return <AdminLogin onLogin={handleLogin} />;
    }

    return (
        <div className="admin-page">
            {/* Mobile overlay */}
            {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-logo">
                    <span className="logo-text">Glaze</span><span className="logo-accent">369</span>
                    <span className="admin-badge">Admin</span>
                </div>
                <nav className="sidebar-nav">
                    {navItems.map(item => (
                        <Link key={item.path} to={item.path}
                            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}>
                            <span className="sidebar-icon">{item.icon}</span>{item.label}
                        </Link>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <button className="btn btn-outline logout-btn" onClick={handleLogout}>🚪 Logout</button>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <div className="header-left">
                        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
                        <h1>{navItems.find(n => n.path === location.pathname)?.label || 'Admin Panel'}</h1>
                    </div>
                    <div className="header-right">
                        <span className="admin-user">👤 {adminUser?.email || 'Admin'}</span>
                    </div>
                </header>
                <div className="admin-content">
                    <Routes>
                        <Route index element={<Dashboard />} />
                        <Route path="bookings" element={<BookingsManagement />} />
                        <Route path="orders" element={<OrdersManagement />} />
                        <Route path="products" element={<ProductsManagement />} />
                        <Route path="payments" element={<PaymentsManagement />} />
                        <Route path="customers" element={<CustomersManagement />} />
                        <Route path="services" element={<ServicesManagement />} />
                        <Route path="gallery" element={<GalleryManagement />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="*" element={<Navigate to="/admin" replace />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}

export default Admin;
