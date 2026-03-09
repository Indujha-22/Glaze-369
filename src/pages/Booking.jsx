import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { services, vehicleTypes, timeSlots } from '../data/services';
import { ref, push, serverTimestamp } from 'firebase/database';
import { database } from '../config/firebase';
import './Booking.css';

function Booking() {
    const location = useLocation();
    const preSelectedService = location.state?.service || '';

    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        vehicleType: '',
        serviceType: preSelectedService,
        preferredDate: '',
        preferredTime: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const bookingsRef = ref(database, 'bookings');
            await push(bookingsRef, {
                ...formData,
                status: 'Pending',
                createdAt: serverTimestamp(),
                date: formData.preferredDate,
                time: formData.preferredTime,
            });
        } catch (err) {
            console.error('Failed to save booking:', err);
        }

        setIsLoading(false);
        setIsSubmitted(true);
    };

    // Get today's date for min date attribute
    const today = new Date().toISOString().split('T')[0];

    if (isSubmitted) {
        return (
            <div className="booking-page">
                <section className="section booking-success">
                    <div className="container">
                        <div className="success-card">
                            <div className="success-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                            </div>
                            <h2>Booking Request Submitted!</h2>
                            <p className="success-message">
                                Thank you, <strong>{formData.name}</strong>! Your booking request has been received.
                            </p>
                            <div className="booking-details">
                                <div className="detail-row">
                                    <span className="detail-label">Service:</span>
                                    <span className="detail-value">{formData.serviceType}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Date:</span>
                                    <span className="detail-value">{new Date(formData.preferredDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Time:</span>
                                    <span className="detail-value">{formData.preferredTime}</span>
                                </div>
                            </div>
                            <div className="confirmation-note">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                </svg>
                                <p>You will receive a confirmation via <strong>WhatsApp</strong> or <strong>phone call</strong> shortly.</p>
                            </div>
                            <div className="success-actions">
                                <a
                                    href={`https://wa.me/919876543210?text=Hi, I just booked a ${formData.serviceType} service for ${formData.preferredDate} at ${formData.preferredTime}. Name: ${formData.name}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    Contact on WhatsApp
                                </a>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setIsSubmitted(false);
                                        setFormData({
                                            name: '',
                                            mobile: '',
                                            vehicleType: '',
                                            serviceType: '',
                                            preferredDate: '',
                                            preferredTime: ''
                                        });
                                    }}
                                >
                                    Book Another Slot
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="booking-page">
            {/* Hero Section */}
            <section className="page-hero booking-hero">
                <div className="page-hero-bg">
                    <img
                        src="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=1920&auto=format&fit=crop"
                        alt="Book a Slot"
                    />
                    <div className="page-hero-overlay"></div>
                </div>
                <div className="container page-hero-content">
                    <span className="section-subtitle">Schedule Your Visit</span>
                    <h1>Book Your Slot</h1>
                    <p>Choose your preferred date and time. We'll confirm your booking via WhatsApp or call.</p>
                </div>
            </section>

            {/* Booking Form */}
            <section className="section">
                <div className="container">
                    <div className="booking-container">
                        <div className="booking-info">
                            <h3>Workshop Location</h3>
                            <div className="info-item">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                <div>
                                    <strong>Glaze369 Workshop</strong>
                                    <p>123 Main Road, Tiruppur, Tamil Nadu 641602</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                                <div>
                                    <strong>Working Hours</strong>
                                    <p>Mon - Sat: 9:00 AM - 7:00 PM</p>
                                    <p>Sunday: Closed</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                </svg>
                                <div>
                                    <strong>Contact</strong>
                                    <p>+91 98765 43210</p>
                                </div>
                            </div>
                            <div className="info-note">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="16" x2="12" y2="12"></line>
                                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                                <p>All services are performed at our workshop. Please bring your vehicle to the above address at your scheduled time.</p>
                            </div>
                        </div>

                        <form className="booking-form" onSubmit={handleSubmit}>
                            <h3>Fill in Your Details</h3>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-input"
                                        placeholder="Enter your name"
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
                                        placeholder="Enter your mobile number"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        pattern="[0-9]{10}"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Vehicle Type *</label>
                                    <select
                                        name="vehicleType"
                                        className="form-select"
                                        value={formData.vehicleType}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select vehicle type</option>
                                        {vehicleTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Service Type *</label>
                                    <select
                                        name="serviceType"
                                        className="form-select"
                                        value={formData.serviceType}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select a service</option>
                                        {services.map(service => (
                                            <option key={service.id} value={service.name}>{service.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Preferred Date *</label>
                                    <input
                                        type="date"
                                        name="preferredDate"
                                        className="form-input"
                                        value={formData.preferredDate}
                                        onChange={handleChange}
                                        min={today}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Preferred Time *</label>
                                    <select
                                        name="preferredTime"
                                        className="form-select"
                                        value={formData.preferredTime}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select a time slot</option>
                                        {timeSlots.map(slot => (
                                            <option key={slot} value={slot}>{slot}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={`btn btn-primary btn-lg submit-btn ${isLoading ? 'loading' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                            <line x1="16" y1="2" x2="16" y2="6"></line>
                                            <line x1="8" y1="2" x2="8" y2="6"></line>
                                            <line x1="3" y1="10" x2="21" y2="10"></line>
                                        </svg>
                                        Book Slot
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Booking;
