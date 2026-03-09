import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { getCartCount } = useCart();
    const { user, logout } = useAuth();
    const cartCount = getCartCount();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/services', label: 'Services' },
        { path: '/products', label: 'Products' },
        { path: '/gallery', label: 'Gallery' },
        { path: '/about', label: 'About' },
        { path: '/contact', label: 'Contact' },
    ];

    return (
        <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-container">
                <Link to="/" className="logo">
                    <span className="logo-text">Glaze</span>
                    <span className="logo-accent">369</span>
                </Link>

                <nav className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                    <ul className="nav-list">
                        {navLinks.map(link => (
                            <li key={link.path} className="nav-item">
                                <Link
                                    to={link.path}
                                    className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    {/* Mobile auth buttons */}
                    <div className="nav-auth-mobile">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                                    {user.photoURL
                                        ? <img src={user.photoURL} alt="profile" className="nav-avatar" />
                                        : <span className="nav-avatar-letter">{user.email?.[0]?.toUpperCase()}</span>}
                                    {user.displayName || user.email?.split('@')[0]}
                                </Link>
                                <button className="btn-nav-logout" onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}>Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn-nav-login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                                <Link to="/signup" className="btn-nav-signup" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
                            </>
                        )}
                    </div>
                </nav>

                <div className="nav-actions">
                    <Link to="/cart" className="cart-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="m1 1 4 4h16l-2.5 7.5H7.5"></path>
                            <path d="M6.5 12.5 5 17h14"></path>
                        </svg>
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </Link>

                    {/* Desktop auth buttons */}
                    {user ? (
                        <div className="nav-user-menu">
                            <Link to="/dashboard" className="nav-user-btn">
                                {user.photoURL
                                    ? <img src={user.photoURL} alt="profile" className="nav-avatar" />
                                    : <span className="nav-avatar-letter">{user.email?.[0]?.toUpperCase()}</span>}
                                <span className="nav-username">{user.displayName || user.email?.split('@')[0]}</span>
                            </Link>
                            <button className="btn-nav-logout" onClick={handleLogout}>Logout</button>
                        </div>
                    ) : (
                        <div className="nav-auth-btns">
                            <Link to="/login" className="btn-nav-login">Login</Link>
                            <Link to="/signup" className="btn-nav-signup">Sign Up</Link>
                        </div>
                    )}

                    <Link to="/booking" className="btn btn-primary nav-cta">
                        Book Slot
                    </Link>
                    <button
                        className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
