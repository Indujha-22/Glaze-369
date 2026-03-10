import { useState, useCallback } from 'react';

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

/**
 * Custom hook for Razorpay payment integration.
 *
 * Usage:
 *   const { initiatePayment, loading, error } = useRazorpay();
 *   await initiatePayment({ amount, customerInfo, cartItems, onSuccess, onFailure });
 */
export default function useRazorpay() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const initiatePayment = useCallback(
        async ({
            amount,           // in ₹ (will be converted to paise)
            customerInfo,     // { name, email, mobile }
            cartItems = [],   // optional
            receipt = '',     // optional receipt id
            onSuccess,        // (response) => void
            onFailure,        // (error) => void
        }) => {
            setLoading(true);
            setError(null);

            try {
                if (!RAZORPAY_KEY) {
                    throw new Error('Razorpay key not configured. Set VITE_RAZORPAY_KEY_ID in .env');
                }

                // Safety-check: is the Razorpay SDK loaded?
                if (typeof window.Razorpay === 'undefined') {
                    throw new Error(
                        'Razorpay SDK not loaded. Check that the script tag is in index.html'
                    );
                }

                const amountInPaise = Math.round(amount * 100);

                const options = {
                    key: RAZORPAY_KEY,
                    amount: amountInPaise,
                    currency: 'INR',
                    name: 'Glaze369 Car Detailing',
                    description: receipt || `Order_${Date.now()}`,
                    image: '/favicon.svg',
                    prefill: {
                        name: customerInfo.name || '',
                        email: customerInfo.email || '',
                        contact: customerInfo.mobile || '',
                    },
                    notes: {
                        customer_name: customerInfo.name || '',
                        customer_email: customerInfo.email || '',
                        items: cartItems.map(i => i.name || '').join(', ').slice(0, 250),
                    },
                    theme: {
                        color: '#ffc107',
                        backdrop_color: 'rgba(0,0,0,0.75)',
                    },
                    modal: {
                        ondismiss: () => {
                            setLoading(false);
                            const err = new Error('Payment cancelled by user');
                            setError(err.message);
                            if (onFailure) onFailure(err);
                        },
                    },
                    handler: (response) => {
                        setLoading(false);
                        if (onSuccess) {
                            onSuccess({
                                orderId: response.razorpay_order_id || `order_${Date.now()}`,
                                paymentId: response.razorpay_payment_id,
                                signature: response.razorpay_signature || '',
                            });
                        }
                    },
                };

                const rzp = new window.Razorpay(options);

                rzp.on('payment.failed', (resp) => {
                    setLoading(false);
                    const failError = new Error(
                        resp.error?.description || 'Payment failed'
                    );
                    setError(failError.message);
                    if (onFailure) onFailure(failError);
                });

                rzp.open();
            } catch (err) {
                setLoading(false);
                setError(err.message);
                if (onFailure) onFailure(err);
            }
        },
        []
    );

    return { initiatePayment, loading, error };
}
