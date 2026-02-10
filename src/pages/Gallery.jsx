import { useState } from 'react';
import { galleryItems, galleryCategories } from '../data/gallery';
import './Gallery.css';

function Gallery() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedItem, setSelectedItem] = useState(null);

    const filteredItems = activeCategory === 'All'
        ? galleryItems
        : galleryItems.filter(item => item.category === activeCategory);

    const openLightbox = (item) => {
        setSelectedItem(item);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setSelectedItem(null);
        document.body.style.overflow = 'auto';
    };

    const navigateGallery = (direction) => {
        const currentIndex = filteredItems.findIndex(item => item.id === selectedItem.id);
        let newIndex;

        if (direction === 'next') {
            newIndex = (currentIndex + 1) % filteredItems.length;
        } else {
            newIndex = currentIndex === 0 ? filteredItems.length - 1 : currentIndex - 1;
        }

        setSelectedItem(filteredItems[newIndex]);
    };

    return (
        <div className="gallery-page">
            {/* Hero Section */}
            <section className="page-hero">
                <div className="page-hero-bg">
                    <img
                        src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1920&auto=format&fit=crop"
                        alt="Gallery"
                    />
                    <div className="page-hero-overlay"></div>
                </div>
                <div className="container page-hero-content">
                    <span className="section-subtitle">Our Work</span>
                    <h1>Gallery</h1>
                    <p>Explore our portfolio of stunning transformations and workshop environment.</p>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="section">
                <div className="container">
                    {/* Category Filter */}
                    <div className="gallery-filter">
                        {galleryCategories.map(category => (
                            <button
                                key={category}
                                className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
                                onClick={() => setActiveCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Gallery Grid */}
                    <div className="gallery-grid">
                        {filteredItems.map((item, index) => (
                            <div
                                key={item.id}
                                className="gallery-item"
                                style={{ animationDelay: `${index * 0.1}s` }}
                                onClick={() => openLightbox(item)}
                            >
                                <img src={item.image} alt={item.title} />
                                <div className="gallery-item-overlay">
                                    <div className="gallery-item-content">
                                        <span className="gallery-category">{item.category}</span>
                                        <h3>{item.title}</h3>
                                        <p>{item.description}</p>
                                    </div>
                                    <div className="gallery-zoom-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                            <line x1="11" y1="8" x2="11" y2="14"></line>
                                            <line x1="8" y1="11" x2="14" y2="11"></line>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Lightbox */}
            {selectedItem && (
                <div className="lightbox" onClick={closeLightbox}>
                    <button className="lightbox-close" onClick={closeLightbox}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    <button
                        className="lightbox-nav prev"
                        onClick={(e) => { e.stopPropagation(); navigateGallery('prev'); }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <img src={selectedItem.image} alt={selectedItem.title} />
                        <div className="lightbox-info">
                            <span className="gallery-category">{selectedItem.category}</span>
                            <h3>{selectedItem.title}</h3>
                            <p>{selectedItem.description}</p>
                        </div>
                    </div>
                    <button
                        className="lightbox-nav next"
                        onClick={(e) => { e.stopPropagation(); navigateGallery('next'); }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}

export default Gallery;
