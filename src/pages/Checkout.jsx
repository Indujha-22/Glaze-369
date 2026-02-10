import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import useRazorpay from '../hooks/useRazorpay';
import './Checkout.css';

function Checkout() {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { initiatePayment, loading: paymentLoading, error: paymentError } = useRazorpay();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        address: '',
        city: '',
        pincode: '',
        paymentMethod: 'online' // default to online
    });
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderInfo, setOrderInfo] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ── Razorpay online payment ──
    const handleOnlinePayment = () => {
        setIsSubmitting(true);

        initiatePayment({
            amount: getCartTotal(),
            customerInfo: {
                name: formData.name,
                email: formData.email,
                mobile: formData.mobile,
            },
            cartItems,
            onSuccess: (response) => {
                setOrderInfo({
                    orderId: response.orderId,
                    paymentId: response.paymentId,
                    method: 'Razorpay (Online)',
                });
                setOrderPlaced(true);
                clearCart();
                setIsSubmitting(false);
            },
            onFailure: () => {
                setIsSubmitting(false);
                // error state is already set inside the hook
            },
        });
    };

    // ── Cash on Delivery ──
    const handleCOD = async () => {
        setIsSubmitting(true);
        // Simulate server acknowledgment
        await new Promise(resolve => setTimeout(resolve, 1200));
        setOrderInfo({
            orderId: `GLZ${Date.now().toString().slice(-8)}`,
            paymentId: '—',
            method: 'Cash on Delivery',
        });
        setOrderPlaced(true);
        clearCart();
        setIsSubmitting(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.paymentMethod === 'online') {
            handleOnlinePayment();
        } else {
            handleCOD();
        }
    };

    // ── Empty cart guard ──
    if (cartItems.length === 0 && !orderPlaced) {
        return (
            <div className="checkout-page">
                <section className="section empty-checkout">
                    <div className="container">
                        <div className="empty-checkout-content">
                            <h2>No Items to Checkout</h2>
                            <p>Your cart is empty. Add some products first.</p>
                            <Link to="/products" className="btn btn-primary">
                                Browse Products
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    // ── Order success screen ──
    if (orderPlaced) {
        return (
            <div className="checkout-page">
                <section className="section order-success">
                    <div className="container">
                        <div className="success-content">
                            <div className="success-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                            </div>
                            <h2>Order Placed Successfully!</h2>
                            <p>Thank you for your order. You will receive a confirmation via WhatsApp/SMS.</p>
                            <div className="order-info">
                                <p><strong>Order ID:</strong> #{orderInfo?.orderId?.slice(-10)}</p>
                                {orderInfo?.paymentId !== '—' && (
                                    <p><strong>Payment ID:</strong> {orderInfo?.paymentId}</p>
                                )}
                                <p><strong>Payment:</strong> {orderInfo?.method}</p>
                            </div>
                            <div className="success-actions">
                                <Link to="/products" className="btn btn-primary">
                                    Continue Shopping
                                </Link>
                                <Link to="/" className="btn btn-secondary">
                                    Go to Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    // ── Main checkout flow ──
    return (
        <div className="checkout-page">
            {/* Header */}
            <section className="checkout-header">
                <div className="container">
                    <h1>Checkout</h1>
                    <div className="checkout-steps">
                        <div className={`step ${step >= 1 ? 'active' : ''}`}>
                            <span className="step-number">1</span>
                            <span className="step-label">Shipping</span>
                        </div>
                        <div className="step-line"></div>
                        <div className={`step ${step >= 2 ? 'active' : ''}`}>
                            <span className="step-number">2</span>
                            <span className="step-label">Payment</span>
                        </div>
                        <div className="step-line"></div>
                        <div className={`step ${step >= 3 ? 'active' : ''}`}>
                            <span className="step-number">3</span>
                            <span className="step-label">Confirm</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Checkout Content */}
            <section className="section">
                <div className="container">
                    <div className="checkout-layout">
                        {/* Form */}
                        <form className="checkout-form" onSubmit={handleSubmit}>
                            {step === 1 && (
                                <div className="form-section">
                                    <h3>Shipping Information</h3>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label className="form-label">Full Name *</label>
                                            <input
                                                type="text"
                                                name="name"
                                                className="form-input"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Mobile Number *</label>
                                            <input
                                                type="tel"
                                                name="mobile"
                                                className="form-input"
                                                value={formData.mobile}
                                                onChange={handleChange}
                                                pattern="[0-9]{10}"
                                                required
                                            />
                                        </div>
                                        <div className="form-group full-width">
                                            <label className="form-label">Email (Optional)</label>
                                            <input
                                                type="email"
                                                name="email"
                                                className="form-input"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group full-width">
                                            <label className="form-label">Delivery Address *</label>
                                            <textarea
                                                name="address"
                                                className="form-textarea"
                                                value={formData.address}
                                                onChange={handleChange}
                                                placeholder="House/Flat No., Street, Landmark"
                                                required
                                            ></textarea>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">City *</label>
                                            <input
                                                type="text"
                                                name="city"
                                                className="form-input"
                                                value={formData.city}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Pincode *</label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                className="form-input"
                                                value={formData.pincode}
                                                onChange={handleChange}
                                                pattern="[0-9]{6}"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => setStep(2)}
                                    >
                                        Continue to Payment
                                    </button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="form-section">
                                    <h3>Payment Method</h3>
                                    <div className="payment-options">
                                        {/* ── Razorpay online ── */}
                                        <label className={`payment-option ${formData.paymentMethod === 'online' ? 'selected' : ''}`}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="online"
                                                checked={formData.paymentMethod === 'online'}
                                                onChange={handleChange}
                                            />
                                            <div className="payment-option-content">
                                                <div className="payment-icon razorpay-icon">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <rect x="1" y="4" width="22" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
                                                        <path d="M1 10h22" stroke="currentColor" strokeWidth="2" />
                                                        <rect x="4" y="14" width="4" height="2" rx="0.5" fill="currentColor" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <strong>Pay Online (Razorpay)</strong>
                                                    <p>UPI • Cards • NetBanking • Wallets</p>
                                                </div>
                                                <span className="recommended-badge">Recommended</span>
                                            </div>
                                        </label>

                                        {/* ── Cash on Delivery ── */}
                                        <label className={`payment-option ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="cod"
                                                checked={formData.paymentMethod === 'cod'}
                                                onChange={handleChange}
                                            />
                                            <div className="payment-option-content">
                                                <div className="payment-icon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                                        <line x1="1" y1="10" x2="23" y2="10"></line>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <strong>Cash on Delivery</strong>
                                                    <p>Pay when you receive your order</p>
                                                </div>
                                            </div>
                                        </label>
                                    </div>

                                    {/* Secure payment strip */}
                                    {formData.paymentMethod === 'online' && (
                                        <div className="secure-badge">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                            </svg>
                                            <span>Secured by <strong>Razorpay</strong> — 256-bit SSL encryption</span>
                                        </div>
                                    )}

                                    <div className="form-actions">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setStep(1)}
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() => setStep(3)}
                                        >
                                            Review Order
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="form-section">
                                    <h3>Review Your Order</h3>
                                    <div className="review-section">
                                        <div className="review-block">
                                            <h4>Shipping Address</h4>
                                            <p>{formData.name}</p>
                                            <p>{formData.address}</p>
                                            <p>{formData.city} - {formData.pincode}</p>
                                            <p>Mobile: {formData.mobile}</p>
                                        </div>
                                        <div className="review-block">
                                            <h4>Payment Method</h4>
                                            <p>
                                                {formData.paymentMethod === 'online'
                                                    ? '💳 Pay Online (Razorpay – UPI / Cards / NetBanking)'
                                                    : '💵 Cash on Delivery'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Razorpay / payment error */}
                                    {paymentError && (
                                        <div className="payment-error">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10" />
                                                <line x1="12" y1="8" x2="12" y2="12" />
                                                <line x1="12" y1="16" x2="12.01" y2="16" />
                                            </svg>
                                            <span>{paymentError}</span>
                                        </div>
                                    )}

                                    <div className="form-actions">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setStep(2)}
                                            disabled={isSubmitting || paymentLoading}
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-pay"
                                            disabled={isSubmitting || paymentLoading}
                                        >
                                            {(isSubmitting || paymentLoading) ? (
                                                <>
                                                    <span className="spinner"></span>
                                                    Processing…
                                                </>
                                            ) : formData.paymentMethod === 'online' ? (
                                                <>
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                                    </svg>
                                                    Pay ₹{getCartTotal().toLocaleString()}
                                                </>
                                            ) : (
                                                'Place Order (COD)'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>

                        {/* Order Summary */}
                        <div className="order-summary">
                            <h3>Order Summary</h3>
                            <div className="summary-items">
                                {cartItems.map(item => (
                                    <div key={item.id} className="summary-item">
                                        <div className="summary-item-image">
                                            <img src={item.image} alt={item.name} />
                                            <span className="item-qty">{item.quantity}</span>
                                        </div>
                                        <div className="summary-item-details">
                                            <h4>{item.name}</h4>
                                            <p>₹{item.price.toLocaleString()}</p>
                                        </div>
                                        <span className="summary-item-total">
                                            ₹{(item.price * item.quantity).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="summary-totals">
                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>₹{getCartTotal().toLocaleString()}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Shipping</span>
                                    <span className="free">FREE</span>
                                </div>
                                <div className="summary-row total">
                                    <span>Total</span>
                                    <span>₹{getCartTotal().toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Checkout;
