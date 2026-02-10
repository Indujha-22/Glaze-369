import { Link } from 'react-router-dom';
import './About.css';

function About() {
    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="page-hero">
                <div className="page-hero-bg">
                    <img
                        src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1920&auto=format&fit=crop"
                        alt="About Glaze369"
                    />
                    <div className="page-hero-overlay"></div>
                </div>
                <div className="container page-hero-content">
                    <span className="section-subtitle">Our Story</span>
                    <h1>About Glaze369</h1>
                    <p>Passion for perfection, dedication to excellence.</p>
                </div>
            </section>

            {/* Story Section */}
            <section className="section">
                <div className="container">
                    <div className="about-grid">
                        <div className="about-content">
                            <span className="section-subtitle">Who We Are</span>
                            <h2 className="section-title">Driven by Passion, Defined by Quality</h2>
                            <div className="divider" style={{ margin: '1rem 0' }}></div>
                            <p>
                                Glaze369 Car Detailing was born from a deep passion for automobiles and an
                                unwavering commitment to excellence. What started as a small dream has grown
                                into Tiruppur's premier destination for professional car care services.
                            </p>
                            <p>
                                Our journey began with a simple belief: every vehicle deserves to look its
                                absolute best. We've built our reputation on meticulous attention to detail,
                                using only premium products and techniques that deliver results beyond expectations.
                            </p>
                            <p>
                                Today, we're proud to serve car enthusiasts across Tiruppur, transforming
                                vehicles one detail at a time. Our skilled team treats every car as if it
                                were their own, ensuring that when you drive away, you're driving a masterpiece.
                            </p>
                        </div>
                        <div className="about-image">
                            <img
                                src="https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800&auto=format&fit=crop"
                                alt="Glaze369 Workshop"
                            />
                            <div className="about-image-accent"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="section values-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-subtitle">Our Values</span>
                        <h2 className="section-title">What Drives Us</h2>
                        <div className="divider"></div>
                    </div>
                    <div className="values-grid">
                        <div className="value-card">
                            <div className="value-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                </svg>
                            </div>
                            <h3>Excellence</h3>
                            <p>We never settle for good enough. Every service we provide meets the highest standards of quality and precision.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                            </div>
                            <h3>Passion</h3>
                            <p>Our love for cars drives everything we do. We're enthusiasts serving enthusiasts with genuine care and expertise.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                </svg>
                            </div>
                            <h3>Trust</h3>
                            <p>We've built lasting relationships with our customers through transparency, honesty, and consistent results.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                            </div>
                            <h3>Attention to Detail</h3>
                            <p>It's in our name and in our nature. We focus on every inch, every surface, every detail that matters.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="section stats-section">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-number">500+</span>
                            <span className="stat-label">Cars Detailed</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">5+</span>
                            <span className="stat-label">Years Experience</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">98%</span>
                            <span className="stat-label">Customer Satisfaction</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">50+</span>
                            <span className="stat-label">5-Star Reviews</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team/Workshop Section */}
            <section className="section">
                <div className="container">
                    <div className="workshop-content">
                        <div className="workshop-text">
                            <span className="section-subtitle">Our Workshop</span>
                            <h2 className="section-title">Where Magic Happens</h2>
                            <div className="divider" style={{ margin: '1rem 0' }}></div>
                            <p>
                                Our state-of-the-art facility in Tiruppur is equipped with the latest
                                tools and technology for professional car detailing. From specialized
                                lighting for paint correction to climate-controlled environments for
                                ceramic coating application, we've invested in everything needed to
                                deliver exceptional results.
                            </p>
                            <p>
                                When you bring your car to Glaze369, you're entrusting it to a team
                                of trained professionals who take pride in their craft. We treat every
                                vehicle with the care and respect it deserves.
                            </p>
                            <Link to="/contact" className="btn btn-primary">
                                Visit Our Workshop
                            </Link>
                        </div>
                        <div className="workshop-images">
                            <div className="workshop-image main">
                                <img
                                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop"
                                    alt="Workshop Interior"
                                />
                            </div>
                            <div className="workshop-image secondary">
                                <img
                                    src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400&auto=format&fit=crop"
                                    alt="Detailing Products"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section">
                <div className="container">
                    <div className="about-cta">
                        <h2>Ready to Experience the Glaze369 Difference?</h2>
                        <p>Book your appointment today and let us transform your vehicle.</p>
                        <Link to="/booking" className="btn btn-primary btn-lg">
                            Book Your Slot
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default About;
