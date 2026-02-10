import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Admin.css';

/* ═══════════════════════════════════════════════════
   ADMIN LOGIN
   ═══════════════════════════════════════════════════ */
function AdminLogin({ onLogin }) {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(r => setTimeout(r, 800));
        if (credentials.username === 'admin' && credentials.password === 'admin123') {
            onLogin();
        } else {
            setError('Invalid credentials. Try admin / admin123');
        }
        setLoading(false);
    };

    return (
        <div className="admin-login">
            <div className="login-card">
                <div className="login-logo">
                    <span className="logo-text">Glaze</span>
                    <span className="logo-accent">369</span>
                </div>
                <h2>Admin Panel</h2>
                <form onSubmit={handleSubmit}>
                    {error && <div className="login-error">{error}</div>}
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input type="text" className="form-input" value={credentials.username}
                            onChange={(e) => setCredentials(p => ({ ...p, username: e.target.value }))}
                            placeholder="Enter username" required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-input" value={credentials.password}
                            onChange={(e) => setCredentials(p => ({ ...p, password: e.target.value }))}
                            placeholder="Enter password" required />
                    </div>
                    <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
                        {loading ? 'Signing in...' : 'Login'}
                    </button>
                </form>
                <p className="login-hint">Demo: admin / admin123</p>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   DASHBOARD
   ═══════════════════════════════════════════════════ */
function Dashboard() {
    const stats = [
        { label: 'Total Bookings', value: '156', change: '+12%', icon: '📅', color: '#3b82f6' },
        { label: 'Pending Bookings', value: '23', change: '+5', icon: '⏳', color: '#f59e0b' },
        { label: 'Product Orders', value: '89', change: '+8%', icon: '📦', color: '#8b5cf6' },
        { label: 'Revenue', value: '₹2.4L', change: '+15%', icon: '💰', color: '#10b981' },
        { label: 'Customers', value: '342', change: '+22', icon: '👥', color: '#ec4899' },
        { label: 'Payments', value: '₹1.8L', change: '+18%', icon: '💳', color: '#06b6d4' },
    ];

    const recentBookings = [
        { id: 'BK001', customer: 'Rajesh Kumar', service: 'Ceramic Coating', date: '2026-02-10', status: 'Confirmed' },
        { id: 'BK002', customer: 'Priya S', service: 'Full Detail', date: '2026-02-10', status: 'Pending' },
        { id: 'BK003', customer: 'Karthik V', service: 'Interior Cleaning', date: '2026-02-09', status: 'Completed' },
        { id: 'BK004', customer: 'Anitha R', service: 'Paint Correction', date: '2026-02-09', status: 'In Progress' },
    ];

    const recentPayments = [
        { id: 'pay_L1x2y3', customer: 'Rajesh Kumar', amount: '₹15,000', method: 'UPI', status: 'Success', date: '2026-02-10' },
        { id: 'pay_A4b5c6', customer: 'Priya S', amount: '₹4,500', method: 'Card', status: 'Success', date: '2026-02-10' },
        { id: 'pay_D7e8f9', customer: 'Vikram S', amount: '₹2,999', method: 'NetBanking', status: 'Failed', date: '2026-02-09' },
    ];

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
                        <span className="stat-change positive">{stat.change}</span>
                    </div>
                ))}
            </div>

            <div className="dash-grid">
                <div className="dashboard-section">
                    <div className="section-head"><h3>Recent Bookings</h3><Link to="/admin/bookings" className="view-all">View All →</Link></div>
                    <div className="data-table">
                        <table>
                            <thead><tr><th>ID</th><th>Customer</th><th>Service</th><th>Date</th><th>Status</th></tr></thead>
                            <tbody>
                                {recentBookings.map(b => (
                                    <tr key={b.id}>
                                        <td><strong>{b.id}</strong></td><td>{b.customer}</td><td>{b.service}</td><td>{b.date}</td>
                                        <td><span className={`status-badge ${b.status.toLowerCase().replace(' ', '-')}`}>{b.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="dashboard-section">
                    <div className="section-head"><h3>Recent Payments</h3><Link to="/admin/payments" className="view-all">View All →</Link></div>
                    <div className="data-table">
                        <table>
                            <thead><tr><th>Payment ID</th><th>Customer</th><th>Amount</th><th>Method</th><th>Status</th></tr></thead>
                            <tbody>
                                {recentPayments.map(p => (
                                    <tr key={p.id}>
                                        <td><code>{p.id}</code></td><td>{p.customer}</td>
                                        <td className="text-accent">{p.amount}</td><td>{p.method}</td>
                                        <td><span className={`status-badge ${p.status.toLowerCase()}`}>{p.status}</span></td>
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
    const [bookings, setBookings] = useState([
        { id: 'BK001', customer: 'Rajesh Kumar', mobile: '9876543210', vehicle: 'BMW 5 Series', service: 'Ceramic Coating', date: '2026-02-10', time: '10:00 AM', status: 'Confirmed' },
        { id: 'BK002', customer: 'Priya Shanmugam', mobile: '9876543211', vehicle: 'Audi Q5', service: 'Full Detail Package', date: '2026-02-10', time: '2:00 PM', status: 'Pending' },
        { id: 'BK003', customer: 'Karthik Venkatesh', mobile: '9876543212', vehicle: 'Mercedes C-Class', service: 'Interior Deep Cleaning', date: '2026-02-09', time: '11:00 AM', status: 'Completed' },
        { id: 'BK004', customer: 'Anitha Rajan', mobile: '9876543213', vehicle: 'Honda City', service: 'Paint Correction', date: '2026-02-09', time: '3:00 PM', status: 'In Progress' },
        { id: 'BK005', customer: 'Vikram Sundaram', mobile: '9876543214', vehicle: 'Porsche 911', service: 'PPF Installation', date: '2026-02-11', time: '9:00 AM', status: 'Confirmed' },
    ]);
    const [filter, setFilter] = useState('All Status');
    const [search, setSearch] = useState('');

    const filtered = bookings.filter(b => {
        const matchStatus = filter === 'All Status' || b.status === filter;
        const matchSearch = b.customer.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    const updateStatus = (id, newStatus) => {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    };

    return (
        <div className="admin-bookings">
            <div className="page-header"><h2>Booking Management</h2><button className="btn btn-primary">+ New Booking</button></div>
            <div className="filters-row">
                <input type="text" className="form-input search-input" placeholder="Search by name or ID..." value={search} onChange={e => setSearch(e.target.value)} />
                <select className="form-select filter-select" value={filter} onChange={e => setFilter(e.target.value)}>
                    {['All Status', 'Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                </select>
            </div>
            <div className="data-table">
                <table>
                    <thead><tr><th>ID</th><th>Customer</th><th>Mobile</th><th>Vehicle</th><th>Service</th><th>Date & Time</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {filtered.map(b => (
                            <tr key={b.id}>
                                <td><strong>{b.id}</strong></td><td>{b.customer}</td><td>{b.mobile}</td><td>{b.vehicle}</td><td>{b.service}</td>
                                <td>{b.date}<br /><small>{b.time}</small></td>
                                <td>
                                    <select className="status-select" value={b.status} onChange={e => updateStatus(b.id, e.target.value)}>
                                        {['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="action-btn" title="WhatsApp" onClick={() => window.open(`https://wa.me/91${b.mobile}`)}>💬</button>
                                        <button className="action-btn delete" title="Delete">🗑</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="table-footer">{filtered.length} of {bookings.length} bookings</div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   ORDERS MANAGEMENT
   ═══════════════════════════════════════════════════ */
function OrdersManagement() {
    const [orders, setOrders] = useState([
        { id: 'ORD001', customer: 'Rajesh Kumar', items: 3, total: '₹6,997', payment: 'Razorpay', paymentId: 'pay_L1x2y3', date: '2026-02-10', status: 'Delivered' },
        { id: 'ORD002', customer: 'Priya S', items: 1, total: '₹4,999', payment: 'COD', paymentId: '—', date: '2026-02-10', status: 'Shipped' },
        { id: 'ORD003', customer: 'Karthik V', items: 2, total: '₹2,198', payment: 'Razorpay', paymentId: 'pay_M2n3o4', date: '2026-02-09', status: 'Processing' },
        { id: 'ORD004', customer: 'Anitha R', items: 4, total: '₹3,296', payment: 'COD', paymentId: '—', date: '2026-02-09', status: 'Pending' },
        { id: 'ORD005', customer: 'Vikram S', items: 1, total: '₹1,499', payment: 'Razorpay', paymentId: 'pay_P5q6r7', date: '2026-02-08', status: 'Cancelled' },
    ]);
    const [filter, setFilter] = useState('All');

    const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);

    const updateStatus = (id, status) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));

    return (
        <div className="admin-orders">
            <div className="page-header"><h2>Product Orders</h2></div>
            <div className="filters-row">
                <input type="text" className="form-input search-input" placeholder="Search orders..." />
                <select className="form-select filter-select" value={filter} onChange={e => setFilter(e.target.value)}>
                    {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                </select>
            </div>
            <div className="data-table">
                <table>
                    <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {filtered.map(o => (
                            <tr key={o.id}>
                                <td><strong>{o.id}</strong></td><td>{o.customer}</td><td>{o.items} items</td>
                                <td className="text-accent">{o.total}</td>
                                <td><span className={`payment-badge ${o.payment.toLowerCase()}`}>{o.payment}</span>{o.paymentId !== '—' && <><br /><code className="pay-id">{o.paymentId}</code></>}</td>
                                <td>{o.date}</td>
                                <td>
                                    <select className="status-select" value={o.status} onChange={e => updateStatus(o.id, e.target.value)}>
                                        {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </td>
                                <td><button className="action-btn">View</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   PAYMENTS (RAZORPAY)
   ═══════════════════════════════════════════════════ */
function PaymentsManagement() {
    const [payments] = useState([
        { id: 'pay_L1x2y3z4', orderId: 'order_A1b2c3', customer: 'Rajesh Kumar', email: 'rajesh@gmail.com', amount: 15000, method: 'UPI', status: 'captured', date: '2026-02-10 10:23 AM' },
        { id: 'pay_M2n3o4p5', orderId: 'order_D4e5f6', customer: 'Priya S', email: 'priya@gmail.com', amount: 4500, method: 'Card', status: 'captured', date: '2026-02-10 02:15 PM' },
        { id: 'pay_N5o6p7q8', orderId: 'order_G7h8i9', customer: 'Vikram S', email: 'vikram@gmail.com', amount: 2999, method: 'NetBanking', status: 'failed', date: '2026-02-09 11:45 AM' },
        { id: 'pay_O8p9q0r1', orderId: 'order_J0k1l2', customer: 'Anitha R', email: 'anitha@gmail.com', amount: 6997, method: 'UPI', status: 'captured', date: '2026-02-09 04:30 PM' },
        { id: 'pay_P1q2r3s4', orderId: 'order_M3n4o5', customer: 'Karthik V', email: 'karthik@gmail.com', amount: 1499, method: 'Wallet', status: 'refunded', date: '2026-02-08 09:10 AM' },
    ]);

    const totalRevenue = payments.filter(p => p.status === 'captured').reduce((s, p) => s + p.amount, 0);
    const failedCount = payments.filter(p => p.status === 'failed').length;

    return (
        <div className="admin-payments">
            <div className="page-header"><h2>💳 Payments (Razorpay)</h2></div>
            <div className="payment-stats">
                <div className="pstat"><span className="pstat-label">Total Revenue</span><span className="pstat-value text-accent">₹{totalRevenue.toLocaleString()}</span></div>
                <div className="pstat"><span className="pstat-label">Successful</span><span className="pstat-value" style={{ color: '#10b981' }}>{payments.filter(p => p.status === 'captured').length}</span></div>
                <div className="pstat"><span className="pstat-label">Failed</span><span className="pstat-value" style={{ color: '#ef4444' }}>{failedCount}</span></div>
                <div className="pstat"><span className="pstat-label">Refunded</span><span className="pstat-value" style={{ color: '#f59e0b' }}>{payments.filter(p => p.status === 'refunded').length}</span></div>
            </div>
            <div className="data-table">
                <table>
                    <thead><tr><th>Payment ID</th><th>Order ID</th><th>Customer</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
                    <tbody>
                        {payments.map(p => (
                            <tr key={p.id}>
                                <td><code>{p.id}</code></td><td><code>{p.orderId}</code></td><td>{p.customer}<br /><small>{p.email}</small></td>
                                <td className="text-accent">₹{p.amount.toLocaleString()}</td>
                                <td><span className="method-badge">{p.method}</span></td>
                                <td><span className={`status-badge ${p.status}`}>{p.status}</span></td>
                                <td>{p.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   CUSTOMERS
   ═══════════════════════════════════════════════════ */
function CustomersManagement() {
    const [customers] = useState([
        { id: 1, name: 'Rajesh Kumar', email: 'rajesh@gmail.com', mobile: '9876543210', orders: 5, totalSpent: '₹32,500', joined: '2025-11-10', lastVisit: '2026-02-10' },
        { id: 2, name: 'Priya Shanmugam', email: 'priya@gmail.com', mobile: '9876543211', orders: 3, totalSpent: '₹18,200', joined: '2025-12-05', lastVisit: '2026-02-09' },
        { id: 3, name: 'Karthik Venkatesh', email: 'karthik@gmail.com', mobile: '9876543212', orders: 8, totalSpent: '₹54,000', joined: '2025-10-20', lastVisit: '2026-02-08' },
        { id: 4, name: 'Anitha Rajan', email: 'anitha@gmail.com', mobile: '9876543213', orders: 2, totalSpent: '₹8,500', joined: '2026-01-15', lastVisit: '2026-02-07' },
        { id: 5, name: 'Vikram Sundaram', email: 'vikram@gmail.com', mobile: '9876543214', orders: 6, totalSpent: '₹45,800', joined: '2025-09-01', lastVisit: '2026-02-10' },
    ]);

    return (
        <div className="admin-customers">
            <div className="page-header"><h2>👥 Customers</h2></div>
            <div className="filters-row">
                <input type="text" className="form-input search-input" placeholder="Search customers..." />
            </div>
            <div className="data-table">
                <table>
                    <thead><tr><th>Name</th><th>Email</th><th>Mobile</th><th>Orders</th><th>Total Spent</th><th>Joined</th><th>Last Visit</th><th>Actions</th></tr></thead>
                    <tbody>
                        {customers.map(c => (
                            <tr key={c.id}>
                                <td><strong>{c.name}</strong></td><td>{c.email}</td><td>{c.mobile}</td>
                                <td>{c.orders}</td><td className="text-accent">{c.totalSpent}</td>
                                <td>{c.joined}</td><td>{c.lastVisit}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="action-btn" onClick={() => window.open(`https://wa.me/91${c.mobile}`)}>💬</button>
                                        <button className="action-btn">👁</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   SERVICES MANAGEMENT
   ═══════════════════════════════════════════════════ */
function ServicesManagement() {
    const [services] = useState([
        { id: 1, name: 'Exterior Wash & Detailing', duration: '2-3 hours', price: '₹1,500 - ₹2,500', status: 'Active' },
        { id: 2, name: 'Interior Deep Cleaning', duration: '3-4 hours', price: '₹2,000 - ₹3,500', status: 'Active' },
        { id: 3, name: 'Ceramic Coating', duration: '1-2 days', price: '₹15,000 - ₹35,000', status: 'Active' },
        { id: 4, name: 'Paint Protection Film', duration: '2-3 days', price: '₹25,000 - ₹1,50,000', status: 'Active' },
        { id: 5, name: 'Engine Bay Cleaning', duration: '1-2 hours', price: '₹1,200 - ₹2,000', status: 'Active' },
        { id: 6, name: 'Headlight Restoration', duration: '1 hour', price: '₹800 - ₹1,500', status: 'Active' },
    ]);

    return (
        <div className="admin-services">
            <div className="page-header"><h2>🔧 Services</h2><button className="btn btn-primary">+ Add Service</button></div>
            <div className="services-grid">
                {services.map(s => (
                    <div key={s.id} className="service-admin-card">
                        <div className="service-admin-header">
                            <h3>{s.name}</h3>
                            <span className={`status-badge ${s.status.toLowerCase()}`}>{s.status}</span>
                        </div>
                        <div className="service-admin-details">
                            <p><strong>Duration:</strong> {s.duration}</p>
                            <p><strong>Price:</strong> {s.price}</p>
                        </div>
                        <div className="service-admin-actions">
                            <button className="btn btn-outline btn-sm">Edit</button>
                            <button className="btn btn-outline btn-sm">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   GALLERY MANAGEMENT
   ═══════════════════════════════════════════════════ */
function GalleryManagement() {
    const images = [
        'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&auto=format&fit=crop',
    ];

    return (
        <div className="admin-gallery">
            <div className="page-header"><h2>🖼 Gallery</h2><button className="btn btn-primary">+ Upload New</button></div>
            <div className="upload-zone">
                <div className="upload-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                    <p>Drag and drop images here</p>
                    <button className="btn btn-outline">Browse Files</button>
                </div>
            </div>
            <div className="gallery-admin-grid">
                {images.map((img, i) => (
                    <div key={i} className="gallery-admin-item">
                        <img src={img} alt={`Gallery ${i + 1}`} />
                        <div className="gallery-admin-overlay">
                            <button className="action-btn">✏️</button>
                            <button className="action-btn delete">🗑</button>
                        </div>
                    </div>
                ))}
            </div>
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
        razorpayKey: 'rzp_test_***',
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
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: '📊' },
        { path: '/admin/bookings', label: 'Bookings', icon: '📅' },
        { path: '/admin/orders', label: 'Orders', icon: '📦' },
        { path: '/admin/payments', label: 'Payments', icon: '💳' },
        { path: '/admin/customers', label: 'Customers', icon: '👥' },
        { path: '/admin/services', label: 'Services', icon: '🔧' },
        { path: '/admin/gallery', label: 'Gallery', icon: '🖼' },
        { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
    ];

    if (!isLoggedIn) {
        return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
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
                    <button className="btn btn-outline logout-btn" onClick={() => setIsLoggedIn(false)}>🚪 Logout</button>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <div className="header-left">
                        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
                        <h1>{navItems.find(n => n.path === location.pathname)?.label || 'Admin Panel'}</h1>
                    </div>
                    <div className="header-right">
                        <span className="admin-user">👤 Admin</span>
                    </div>
                </header>
                <div className="admin-content">
                    <Routes>
                        <Route index element={<Dashboard />} />
                        <Route path="bookings" element={<BookingsManagement />} />
                        <Route path="orders" element={<OrdersManagement />} />
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
