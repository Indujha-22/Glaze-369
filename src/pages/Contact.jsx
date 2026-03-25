import './Contact.css';

function Contact() {
    return (
        <div className="contact-page">
            {/* Hero Section */}
            <section className="page-hero">
                <div className="page-hero-bg">
                    <img
                        src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1920&auto=format&fit=crop"
                        alt="Contact Us"
                    />
                    <div className="page-hero-overlay"></div>
                </div>
                <div className="container page-hero-content">
                    <span className="section-subtitle">Get in Touch</span>
                    <h1>Contact Us</h1>
                    <p>We'd love to hear from you. Visit our workshop or reach out anytime.</p>
                </div>
            </section>

            {/* Contact Section */}
            <section className="section">
                <div className="container">
                    <div className="contact-grid">
                        {/* Contact Info */}
                        <div className="contact-info">
                            <h2>Visit Our Workshop</h2>
                            <p className="contact-intro">
                                Experience premium car detailing at our fully-equipped workshop in Tiruppur.
                                Drop by or give us a call to schedule your appointment.
                            </p>

                            <div className="contact-cards">
                                <div className="contact-card">
                                    <div className="contact-card-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                            <circle cx="12" cy="10" r="3"></circle>
                                        </svg>
                                    </div>
                                    <div className="contact-card-content">
                                        <h3>Workshop Address</h3>
                                        <p>GLAZE369, Chinnakarai</p>
                                        <p>Tiruppur, Tamil Nadu 641605</p>
                                    </div>
                                </div>

                                <div className="contact-card">
                                    <div className="contact-card-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                        </svg>
                                    </div>
                                    <div className="contact-card-content">
                                        <h3>Phone</h3>
                                        <a href="tel:+919025392523">+91 90253 92523</a>
                                    </div>
                                </div>

                                <div className="contact-card">
                                    <div className="contact-card-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                            <polyline points="22,6 12,13 2,6"></polyline>
                                        </svg>
                                    </div>
                                    <div className="contact-card-content">
                                        <h3>Email</h3>
                                        <a href="mailto:info@glaze369.com">info@glaze369.com</a>
                                        <a href="mailto:bookings@glaze369.com">bookings@glaze369.com</a>
                                    </div>
                                </div>

                                <div className="contact-card">
                                    <div className="contact-card-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <polyline points="12 6 12 12 16 14"></polyline>
                                        </svg>
                                    </div>
                                    <div className="contact-card-content">
                                        <h3>Business Hours</h3>
                                        <p>Monday - Saturday: 9:00 AM - 7:00 PM</p>
                                        <p>Sunday: Closed</p>
                                    </div>
                                </div>
                            </div>

                            {/* WhatsApp Button */}
                            <a
                                href="https://wa.me/919025392523?text=Hi, I'm interested in your car detailing services."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="whatsapp-btn"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                Chat on WhatsApp
                            </a>
                        </div>

                        {/* Map */}
                        <div className="contact-map">
                            <div className="map-container">
                                <iframe
                                    src="https://www.google.com/maps?q=GLAZE369,+Chinnakarai,+Tiruppur,+Tamil+Nadu+641605&output=embed"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Glaze369 Location"
                                ></iframe>
                            </div>
                            <a
                                href="https://maps.app.goo.gl/KtzHNiHgE3QRnRn68?g_st=aw"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary map-btn"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                                </svg>
                                Get Directions
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="section faq-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-subtitle">FAQ</span>
                        <h2 className="section-title">Frequently Asked Questions</h2>
                        <div className="divider"></div>
                    </div>
                    <div className="faq-grid">
                        <div className="faq-item">
                            <h3>Do I need to book in advance?</h3>
                            <p>We recommend booking at least 24-48 hours in advance to ensure slot availability, especially for services like ceramic coating or PPF which require longer time.</p>
                        </div>
                        <div className="faq-item">
                            <h3>How long does a full detail take?</h3>
                            <p>A full detail typically takes 6-8 hours depending on the vehicle's condition. Ceramic coating may require 1-2 days for proper curing.</p>
                        </div>
                        <div className="faq-item">
                            <h3>What payment methods do you accept?</h3>
                            <p>We accept cash, UPI, all major credit/debit cards, and bank transfers. Payment is collected after service completion.</p>
                        </div>
                        <div className="faq-item">
                            <h3>Do you offer any warranty?</h3>
                            <p>Yes! Our ceramic coatings come with warranties ranging from 2-5 years, and PPF installations are backed by manufacturer warranties of up to 10 years.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Contact;
