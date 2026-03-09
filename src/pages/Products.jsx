import { useState, useEffect } from 'react';
import { products as localProducts, categories as localCategories } from '../data/products';
import { useCart } from '../context/CartContext';
import { ref, onValue } from 'firebase/database';
import { database } from '../config/firebase';
import './Products.css';

function Products() {
    const [activeCategory, setActiveCategory] = useState('All Products');
    const [notification, setNotification] = useState(null);
    const [products, setProducts] = useState(localProducts);
    const { addToCart } = useCart();

    // Load products from Firebase (falls back to local data)
    useEffect(() => {
        const unsub = onValue(ref(database, 'products'), snap => {
            const data = snap.val();
            if (data) {
                const list = Object.entries(data)
                    .map(([k, v]) => ({ ...v, id: k }))
                    .filter(p => p.inStock !== false);
                setProducts(list);
            }
        });
        return () => unsub();
    }, []);

    const categories = ['All Products', ...new Set(products.map(p => p.category).filter(Boolean))];

    const filteredProducts = activeCategory === 'All Products'
        ? products
        : products.filter(product => product.category === activeCategory);

    const handleAddToCart = (product) => {
        addToCart(product);
        setNotification(`${product.name} added to cart!`);
        setTimeout(() => setNotification(null), 3000);
    };

    const handleBuyNow = (product) => {
        addToCart(product);
        window.location.href = '/checkout';
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <span key={i} className={`star ${i < Math.floor(rating) ? '' : 'empty'}`}>★</span>
        ));
    };

    return (
        <div className="products-page">
            {/* Notification */}
            {notification && (
                <div className="notification">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    {notification}
                </div>
            )}

            {/* Hero Section */}
            <section className="page-hero">
                <div className="page-hero-bg">
                    <img
                        src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1920&auto=format&fit=crop"
                        alt="Car Care Products"
                    />
                    <div className="page-hero-overlay"></div>
                </div>
                <div className="container page-hero-content">
                    <span className="section-subtitle">Premium Products</span>
                    <h1>Car Care Products</h1>
                    <p>Professional-grade detailing products for enthusiasts and professionals alike.</p>
                </div>
            </section>

            {/* Products Section */}
            <section className="section">
                <div className="container">
                    {/* Category Filter */}
                    <div className="category-filter">
                        {categories.map(category => (
                            <button
                                key={category}
                                className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
                                onClick={() => setActiveCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Products Grid */}
                    <div className="products-grid">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className={`product-card ${product.featured ? 'featured' : ''}`}>
                                {product.featured && <span className="featured-badge">Featured</span>}
                                <div className="product-image">
                                    <img src={product.image} alt={product.name} />
                                    {product.originalPrice > product.price && (
                                        <span className="discount-badge">
                                            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                                        </span>
                                    )}
                                </div>
                                <div className="product-content">
                                    <span className="product-category">{product.category}</span>
                                    <h3 className="product-title">{product.name}</h3>
                                    <p className="product-description">{product.description}</p>
                                    <div className="product-rating">
                                        <div className="stars">{renderStars(product.rating)}</div>
                                        <span className="review-count">({product.reviews})</span>
                                    </div>
                                    <div className="product-pricing">
                                        <span className="current-price">₹{product.price.toLocaleString()}</span>
                                        {product.originalPrice > product.price && (
                                            <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
                                        )}
                                    </div>
                                    <div className="product-actions">
                                        <button
                                            className="btn btn-outline btn-sm"
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="9" cy="21" r="1"></circle>
                                                <circle cx="20" cy="21" r="1"></circle>
                                                <path d="m1 1 4 4h16l-2.5 7.5H7.5"></path>
                                                <path d="M6.5 12.5 5 17h14"></path>
                                            </svg>
                                            Add to Cart
                                        </button>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleBuyNow(product)}
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Products;
