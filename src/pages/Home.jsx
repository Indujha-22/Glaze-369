import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { services as localServices } from '../data/services';
import { testimonials } from '../data/testimonials';
import { onValue, ref } from 'firebase/database';
import { database } from '../config/firebase';
import './Home.css';

function Home() {
    const [services, setServices] = useState(localServices);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [isVisible, setIsVisible] = useState({});
    const sectionRefs = useRef({});

    useEffect(() => {
        const servicesRef = ref(database, 'services');
        const unsubscribe = onValue(servicesRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) {
                setServices(localServices);
                return;
            }

            const normalizedServices = Object.values(data)
                .map((service) => ({
                    ...service,
                    status: service.status || 'Active',
                    name: service.name || '',
                }))
                .filter((service) => service.status !== 'Inactive' && service.name);

            setServices(normalizedServices.length > 0 ? normalizedServices : localServices);
        });

        return () => unsubscribe();
    }, []);

    // Auto-rotate testimonials
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    // Intersection observer for animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
                    }
                });
            },
            { threshold: 0.1 }
        );

        Object.values(sectionRefs.current).forEach(ref => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <span key={i} className={`star ${i < rating ? '' : 'empty'}`}>★</span>
        ));
    };

    const featuredServices = services.slice(0, 6);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-video-container">
                    <video
                        className="hero-video"
                        autoPlay
                        muted
                        loop
                        playsInline
                        poster="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=1920&auto=format&fit=crop"
                    >
                        <source src="https://cdn.coverr.co/videos/coverr-car-wash-8421/1080p.mp4" type="video/mp4" />
                    </video>
                    <div className="hero-overlay"></div>
                </div>
                <div className="hero-content">
                    <div className="container">
                        <span className="hero-badge animate-fade-in">Premium Car Care</span>
                        <h1 className="hero-title animate-fade-in-up">
                            Professional Car Detailing<br />
                            <span className="gradient-text">in Tiruppur</span>
                        </h1>
                        <p className="hero-subtitle animate-fade-in-up">
                            Premium care for your car with expert detailing. Experience the difference
                            with our skilled professionals and industry-leading products.
                        </p>
                        <div className="hero-buttons animate-fade-in-up">
                            <Link to="/booking" className="btn btn-primary btn-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                Book Slot
                            </Link>
                            <a
                                href="https://maps.google.com/?q=Tiruppur,Tamil+Nadu"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-secondary btn-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                Get Directions
                            </a>
                        </div>
                        <div className="hero-stats">
                            <div className="stat">
                                <span className="stat-number">500+</span>
                                <span className="stat-label">Cars Detailed</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">5+</span>
                                <span className="stat-label">Years Experience</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">4.9</span>
                                <span className="stat-label">Customer Rating</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hero-scroll-indicator">
                    <span>Scroll to explore</span>
                    <div className="scroll-arrow"></div>
                </div>
            </section>

            {/* Services Preview Section */}
            <section
                id="services-section"
                className={`section services-preview ${isVisible['services-section'] ? 'visible' : ''}`}
                ref={el => sectionRefs.current['services-section'] = el}
            >
                <div className="container">
                    <div className="section-header">
                        <span className="section-subtitle">What We Offer</span>
                        <h2 className="section-title">Our Premium Services</h2>
                        <div className="divider"></div>
                        <p className="section-description">
                            From basic wash to complete paint protection, we deliver excellence
                            in every service at our Tiruppur workshop.
                        </p>
                    </div>
                    <div className="services-grid">
                        {featuredServices.map((service, index) => (
                            <div
                                key={service.id || service.firebaseKey || `${service.name}-${index}`}
                                className="service-card"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="service-card-image">
                                    <img src={service.image} alt={service.name} />
                                    <div className="service-card-overlay">
                                        <span className="service-duration">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <polyline points="12 6 12 12 16 14"></polyline>
                                            </svg>
                                            {service.duration}
                                        </span>
                                    </div>
                                </div>
                                <div className="service-card-content">
                                    <h3 className="service-card-title">{service.name}</h3>
                                    <p className="service-card-description">{service.shortDescription}</p>
                                    <div className="service-card-footer">
                                        <span className="service-price">{service.priceRange}</span>
                                        <Link to="/services" className="btn btn-outline btn-sm">
                                            Read More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-xl">
                        <Link to="/services" className="btn btn-primary">
                            View All Services
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section
                id="why-section"
                className={`section why-section ${isVisible['why-section'] ? 'visible' : ''}`}
                ref={el => sectionRefs.current['why-section'] = el}
            >
                <div className="container">
                    <div className="why-grid">
                        <div className="why-content">
                            <span className="section-subtitle">Why Glaze369</span>
                            <h2 className="section-title">Why Choose Us?</h2>
                            <div className="divider" style={{ margin: '1rem 0' }}></div>
                            <p className="why-description">
                                At Glaze369, we're passionate about transforming vehicles. Our commitment
                                to excellence and customer satisfaction sets us apart in Tiruppur's car
                                care industry.
                            </p>
                            <div className="why-features">
                                <div className="why-feature">
                                    <div className="why-feature-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="9" cy="7" r="4"></circle>
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                        </svg>
                                    </div>
                                    <div className="why-feature-content">
                                        <h4>Skilled Professionals</h4>
                                        <p>Our certified technicians have years of experience in premium car detailing.</p>
                                    </div>
                                </div>
                                <div className="why-feature">
                                    <div className="why-feature-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                        </svg>
                                    </div>
                                    <div className="why-feature-content">
                                        <h4>Premium Products</h4>
                                        <p>We use only industry-leading products and the latest detailing technology.</p>
                                    </div>
                                </div>
                                <div className="why-feature">
                                    <div className="why-feature-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                            <polyline points="9 12 11 14 15 10"></polyline>
                                        </svg>
                                    </div>
                                    <div className="why-feature-content">
                                        <h4>Trusted Local Service</h4>
                                        <p>Proudly serving Tiruppur with a reputation built on trust and quality.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="why-image">
                            <div className="why-image-container">
                                <img
                                    src="https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800&auto=format&fit=crop"
                                    alt="Professional Detailing"
                                />
                                <div className="why-image-badge">
                                    <span className="badge-number">5+</span>
                                    <span className="badge-text">Years of Excellence</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section
                id="testimonials-section"
                className={`section testimonials-section ${isVisible['testimonials-section'] ? 'visible' : ''}`}
                ref={el => sectionRefs.current['testimonials-section'] = el}
            >
                <div className="container">
                    <div className="section-header">
                        <span className="section-subtitle">Testimonials</span>
                        <h2 className="section-title">What Our Customers Say</h2>
                        <div className="divider"></div>
                    </div>
                    <div className="testimonials-container">
                        <div className="testimonials-slider">
                            {testimonials.map((testimonial, index) => (
                                <div
                                    key={testimonial.id}
                                    className={`testimonial-card ${index === currentTestimonial ? 'active' : ''}`}
                                >
                                    <div className="testimonial-quote">"</div>
                                    <p className="testimonial-text">{testimonial.text}</p>
                                    <div className="testimonial-rating">
                                        {renderStars(testimonial.rating)}
                                    </div>
                                    <div className="testimonial-author">
                                        <img src={testimonial.image} alt={testimonial.name} className="testimonial-avatar" />
                                        <div className="testimonial-info">
                                            <h4>{testimonial.name}</h4>
                                            <span>{testimonial.role}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="testimonials-dots">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    className={`dot ${index === currentTestimonial ? 'active' : ''}`}
                                    onClick={() => setCurrentTestimonial(index)}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section cta-section">
                <div className="cta-background"></div>
                <div className="container">
                    <div className="cta-content">
                        <h2 className="cta-title">Ready to Transform Your Car?</h2>
                        <p className="cta-description">
                            Book your appointment today and experience the Glaze369 difference.
                            Your car deserves the best care.
                        </p>
                        <div className="cta-buttons">
                            <Link to="/booking" className="btn btn-primary btn-lg">
                                Book Your Slot Now
                            </Link>
                            <a href="tel:+919876543210" className="btn btn-secondary btn-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                </svg>
                                Call Us Now
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
