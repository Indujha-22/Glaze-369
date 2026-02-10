import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

function Cart() {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                <section className="section empty-cart">
                    <div className="container">
                        <div className="empty-cart-content">
                            <div className="empty-cart-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="9" cy="21" r="1"></circle>
                                    <circle cx="20" cy="21" r="1"></circle>
                                    <path d="m1 1 4 4h16l-2.5 7.5H7.5"></path>
                                    <path d="M6.5 12.5 5 17h14"></path>
                                </svg>
                            </div>
                            <h2>Your Cart is Empty</h2>
                            <p>Looks like you haven't added any products yet.</p>
                            <Link to="/products" className="btn btn-primary">
                                Browse Products
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="cart-page">
            {/* Header */}
            <section className="cart-header">
                <div className="container">
                    <h1>Shopping Cart</h1>
                    <p>{cartItems.length} item{cartItems.length > 1 ? 's' : ''} in your cart</p>
                </div>
            </section>

            {/* Cart Content */}
            <section className="section">
                <div className="container">
                    <div className="cart-layout">
                        {/* Cart Items */}
                        <div className="cart-items">
                            {cartItems.map(item => (
                                <div key={item.id} className="cart-item">
                                    <div className="cart-item-image">
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                    <div className="cart-item-details">
                                        <h3>{item.name}</h3>
                                        <p className="cart-item-category">{item.category}</p>
                                        <p className="cart-item-price">₹{item.price.toLocaleString()}</p>
                                    </div>
                                    <div className="cart-item-quantity">
                                        <button
                                            className="qty-btn"
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        >
                                            −
                                        </button>
                                        <span className="qty-value">{item.quantity}</span>
                                        <button
                                            className="qty-btn"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="cart-item-total">
                                        <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                    <button
                                        className="cart-item-remove"
                                        onClick={() => removeFromCart(item.id)}
                                        aria-label="Remove item"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        </svg>
                                    </button>
                                </div>
                            ))}
                            <button className="clear-cart-btn" onClick={clearCart}>
                                Clear Cart
                            </button>
                        </div>

                        {/* Cart Summary */}
                        <div className="cart-summary">
                            <h3>Order Summary</h3>
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{getCartTotal().toLocaleString()}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span className="free-shipping">FREE</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>₹{getCartTotal().toLocaleString()}</span>
                            </div>
                            <Link to="/checkout" className="btn btn-primary btn-lg checkout-btn">
                                Proceed to Checkout
                            </Link>
                            <Link to="/products" className="continue-shopping">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Cart;
