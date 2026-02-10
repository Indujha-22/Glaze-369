import { useState } from 'react';
import { Link } from 'react-router-dom';
import { services, vehicleTypes } from '../data/services';
import './Services.css';

function Services() {
    const [expandedService, setExpandedService] = useState(null);

    const toggleExpand = (serviceId) => {
        setExpandedService(expandedService === serviceId ? null : serviceId);
    };

    return (
        <div className="services-page">
            {/* Hero Section */}
            <section className="page-hero">
                <div className="page-hero-bg">
                    <img
                        src="https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=1920&auto=format&fit=crop"
                        alt="Car Detailing"
                    />
                    <div className="page-hero-overlay"></div>
                </div>
                <div className="container page-hero-content">
                    <span className="section-subtitle">Our Expertise</span>
                    <h1>Our Services</h1>
                    <p>Premium detailing services performed at our Tiruppur workshop. Expert care for every vehicle.</p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="section">
                <div className="container">
                    <div className="services-notice">
                        <div className="notice-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                        </div>
                        <div className="notice-content">
                            <h3>Workshop-Based Service</h3>
                            <p>All our detailing services are performed at our fully-equipped workshop in Tiruppur. Book your slot and bring your vehicle for the best results.</p>
                        </div>
                    </div>

                    <div className="services-list">
                        {services.map((service, index) => (
                            <div
                                key={service.id}
                                className={`service-item ${expandedService === service.id ? 'expanded' : ''}`}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="service-item-main">
                                    <div className="service-item-image">
                                        <img src={service.image} alt={service.name} />
                                        <div className="service-item-badge">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <polyline points="12 6 12 12 16 14"></polyline>
                                            </svg>
                                            {service.duration}
                                        </div>
                                    </div>
                                    <div className="service-item-content">
                                        <h3 className="service-item-title">{service.name}</h3>
                                        <p className="service-item-description">{service.shortDescription}</p>
                                        <div className="service-item-meta">
                                            <span className="service-item-price">{service.priceRange}</span>
                                            <div className="service-item-actions">
                                                <button
                                                    className="btn btn-outline btn-sm"
                                                    onClick={() => toggleExpand(service.id)}
                                                >
                                                    {expandedService === service.id ? 'Show Less' : 'Read More'}
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16" height="16" viewBox="0 0 24 24"
                                                        fill="none" stroke="currentColor" strokeWidth="2"
                                                        strokeLinecap="round" strokeLinejoin="round"
                                                        className={`icon-chevron ${expandedService === service.id ? 'rotated' : ''}`}
                                                    >
                                                        <polyline points="6 9 12 15 18 9"></polyline>
                                                    </svg>
                                                </button>
                                                <Link to="/booking" state={{ service: service.name }} className="btn btn-primary btn-sm">
                                                    Book Slot
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="service-item-details">
                                    <div className="service-details-content">
                                        <div className="service-details-description">
                                            <h4>About This Service</h4>
                                            <p>{service.fullDescription}</p>
                                        </div>
                                        <div className="service-details-features">
                                            <h4>What's Included</h4>
                                            <ul className="features-list">
                                                {service.features.map((feature, idx) => (
                                                    <li key={idx}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="20 6 9 17 4 12"></polyline>
                                                        </svg>
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vehicle Types */}
            <section className="section vehicle-types-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-subtitle">We Detail All</span>
                        <h2 className="section-title">Vehicle Types We Service</h2>
                        <div className="divider"></div>
                    </div>
                    <div className="vehicle-types-grid">
                        {vehicleTypes.map((type, index) => (
                            <div key={index} className="vehicle-type-card">
                                <div className="vehicle-type-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-2-4H8l-2 4-2.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2"></path>
                                        <circle cx="7" cy="17" r="2"></circle>
                                        <path d="M9 17h6"></path>
                                        <circle cx="17" cy="17" r="2"></circle>
                                    </svg>
                                </div>
                                <span>{type}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section">
                <div className="container">
                    <div className="services-cta">
                        <h2>Ready to Book Your Service?</h2>
                        <p>Choose a service and book your preferred time slot. We'll take care of the rest.</p>
                        <Link to="/booking" className="btn btn-primary btn-lg">
                            Book Your Slot Now
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Services;
