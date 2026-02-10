import { useState, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

    /** ────────────────────────────────────────────
     *  Flow:
     *   1. POST /api/payment/create-order  → Razorpay order_id
     *   2. Open Razorpay checkout modal
     *   3. On success → POST /api/payment/verify  → verified boolean
     *  ──────────────────────────────────────────── */
    const initiatePayment = useCallback(
        async ({
            amount,           // in ₹ (will be converted to paise)
            customerInfo,     // { name, email, mobile }
            cartItems = [],   // optional — stored on backend for record-keeping
            receipt = '',     // optional receipt id
            onSuccess,        // (response) => void
            onFailure,        // (error) => void
        }) => {
            setLoading(true);
            setError(null);

            try {
                /* ── Step 1: Create an order on the backend ── */
                const orderRes = await fetch(`${API_BASE}/payment/create-order`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount,
                        currency: 'INR',
                        receipt: receipt || `rcpt_${Date.now()}`,
                        customerInfo,
                        cartItems,
                    }),
                });

                const orderData = await orderRes.json();

                if (!orderRes.ok || !orderData.success) {
                    throw new Error(orderData.message || 'Failed to create order');
                }

                /* ── Step 2: Open Razorpay checkout ── */
                const options = {
                    key: orderData.key,                 // public key from backend
                    amount: orderData.order.amount,      // in paise
                    currency: orderData.order.currency,
                    name: 'Glaze369 Car Detailing',
                    description: `Order #${orderData.order.id.slice(-8)}`,
                    order_id: orderData.order.id,
                    image: '/favicon.svg',
                    prefill: {
                        name: customerInfo.name || '',
                        email: customerInfo.email || '',
                        contact: customerInfo.mobile || '',
                    },
                    notes: {
                        customer_name: customerInfo.name || '',
                        customer_email: customerInfo.email || '',
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
                    handler: async (response) => {
                        /* ── Step 3: Verify on the backend ── */
                        try {
                            const verifyRes = await fetch(`${API_BASE}/payment/verify`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                }),
                            });

                            const verifyData = await verifyRes.json();

                            if (!verifyRes.ok || !verifyData.success) {
                                throw new Error(verifyData.message || 'Payment verification failed');
                            }

                            setLoading(false);
                            if (onSuccess) {
                                onSuccess({
                                    orderId: response.razorpay_order_id,
                                    paymentId: response.razorpay_payment_id,
                                    signature: response.razorpay_signature,
                                    ...verifyData,
                                });
                            }
                        } catch (verifyError) {
                            setLoading(false);
                            setError(verifyError.message);
                            if (onFailure) onFailure(verifyError);
                        }
                    },
                };

                // Safety-check: is the Razorpay SDK loaded?
                if (typeof window.Razorpay === 'undefined') {
                    throw new Error(
                        'Razorpay SDK not loaded. Check that the script tag is in index.html'
                    );
                }

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
