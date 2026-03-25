import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { ref, get, set, update, remove, push } from 'firebase/database';
import { database } from '../config/firebase';

const AdminContext = createContext({});

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};

export const AdminProvider = ({ children }) => {
    const { user } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    // Check if user is admin
    useEffect(() => {
        const checkAdminStatus = async () => {
            if (!user) {
                setIsAdmin(false);
                setLoading(false);
                return;
            }

            try {
                // Check if user email is in admin list or has admin role
                const adminRef = ref(database, `admins/${user.uid}`);
                const snapshot = await get(adminRef);

                if (snapshot.exists() && snapshot.val().isAdmin === true) {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error('Error checking admin status:', error);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };

        checkAdminStatus();
    }, [user]);

    // CRUD Operations for Bookings
    const createBooking = async (bookingData) => {
        try {
            const bookingsRef = ref(database, 'bookings');
            const newBookingRef = push(bookingsRef);
            await set(newBookingRef, {
                ...bookingData,
                id: newBookingRef.key,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            return { success: true, id: newBookingRef.key };
        } catch (error) {
            console.error('Error creating booking:', error);
            throw error;
        }
    };

    const updateBooking = async (bookingId, updates) => {
        try {
            const bookingRef = ref(database, `bookings/${bookingId}`);
            await update(bookingRef, {
                ...updates,
                updatedAt: new Date().toISOString()
            });
            return { success: true };
        } catch (error) {
            console.error('Error updating booking:', error);
            throw error;
        }
    };

    const deleteBooking = async (bookingId) => {
        try {
            const bookingRef = ref(database, `bookings/${bookingId}`);
            await remove(bookingRef);
            return { success: true };
        } catch (error) {
            console.error('Error deleting booking:', error);
            throw error;
        }
    };

    const getAllBookings = async () => {
        try {
            const bookingsRef = ref(database, 'bookings');
            const snapshot = await get(bookingsRef);
            if (snapshot.exists()) {
                const bookingsData = snapshot.val();
                return Object.values(bookingsData);
            }
            return [];
        } catch (error) {
            console.error('Error getting bookings:', error);
            throw error;
        }
    };

    // CRUD Operations for Services
    const createService = async (serviceData) => {
        try {
            const servicesRef = ref(database, 'services');
            const newServiceRef = push(servicesRef);
            await set(newServiceRef, {
                ...serviceData,
                id: newServiceRef.key,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            return { success: true, id: newServiceRef.key };
        } catch (error) {
            console.error('Error creating service:', error);
            throw error;
        }
    };

    const updateService = async (serviceId, updates) => {
        try {
            const serviceRef = ref(database, `services/${serviceId}`);
            await update(serviceRef, {
                ...updates,
                updatedAt: new Date().toISOString()
            });
            return { success: true };
        } catch (error) {
            console.error('Error updating service:', error);
            throw error;
        }
    };

    const deleteService = async (serviceId) => {
        try {
            const serviceRef = ref(database, `services/${serviceId}`);
            await remove(serviceRef);
            return { success: true };
        } catch (error) {
            console.error('Error deleting service:', error);
            throw error;
        }
    };

    const getAllServices = async () => {
        try {
            const servicesRef = ref(database, 'services');
            const snapshot = await get(servicesRef);
            if (snapshot.exists()) {
                const servicesData = snapshot.val();
                return Object.values(servicesData);
            }
            return [];
        } catch (error) {
            console.error('Error getting services:', error);
            throw error;
        }
    };

    // CRUD Operations for Products
    const createProduct = async (productData) => {
        try {
            const productsRef = ref(database, 'products');
            const newProductRef = push(productsRef);
            await set(newProductRef, {
                ...productData,
                id: newProductRef.key,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            return { success: true, id: newProductRef.key };
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    };

    const updateProduct = async (productId, updates) => {
        try {
            const productRef = ref(database, `products/${productId}`);
            await update(productRef, {
                ...updates,
                updatedAt: new Date().toISOString()
            });
            return { success: true };
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    };

    const deleteProduct = async (productId) => {
        try {
            const productRef = ref(database, `products/${productId}`);
            await remove(productRef);
            return { success: true };
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    };

    const getAllProducts = async () => {
        try {
            const productsRef = ref(database, 'products');
            const snapshot = await get(productsRef);
            if (snapshot.exists()) {
                const productsData = snapshot.val();
                return Object.values(productsData);
            }
            return [];
        } catch (error) {
            console.error('Error getting products:', error);
            throw error;
        }
    };

    // CRUD Operations for Gallery
    const createGalleryItem = async (galleryData) => {
        try {
            const galleryRef = ref(database, 'gallery');
            const newGalleryRef = push(galleryRef);
            await set(newGalleryRef, {
                ...galleryData,
                id: newGalleryRef.key,
                createdAt: new Date().toISOString()
            });
            return { success: true, id: newGalleryRef.key };
        } catch (error) {
            console.error('Error creating gallery item:', error);
            throw error;
        }
    };

    const updateGalleryItem = async (galleryId, updates) => {
        try {
            const galleryRef = ref(database, `gallery/${galleryId}`);
            await update(galleryRef, {
                ...updates,
                updatedAt: new Date().toISOString()
            });
            return { success: true };
        } catch (error) {
            console.error('Error updating gallery item:', error);
            throw error;
        }
    };

    const deleteGalleryItem = async (galleryId) => {
        try {
            const galleryRef = ref(database, `gallery/${galleryId}`);
            await remove(galleryRef);
            return { success: true };
        } catch (error) {
            console.error('Error deleting gallery item:', error);
            throw error;
        }
    };

    const getAllGalleryItems = async () => {
        try {
            const galleryRef = ref(database, 'gallery');
            const snapshot = await get(galleryRef);
            if (snapshot.exists()) {
                const galleryData = snapshot.val();
                return Object.values(galleryData);
            }
            return [];
        } catch (error) {
            console.error('Error getting gallery items:', error);
            throw error;
        }
    };

    const value = {
        isAdmin,
        loading,
        // Bookings
        createBooking,
        updateBooking,
        deleteBooking,
        getAllBookings,
        // Services
        createService,
        updateService,
        deleteService,
        getAllServices,
        // Products
        createProduct,
        updateProduct,
        deleteProduct,
        getAllProducts,
        // Gallery
        createGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        getAllGalleryItems,
    };

    return (
        <AdminContext.Provider value={value}>
            {!loading && children}
        </AdminContext.Provider>
    );
};
