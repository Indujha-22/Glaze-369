# Glaze369 Car Detailing 🚗✨

A modern, premium web application for car detailing services with integrated authentication system.

## 🌟 Features

### Authentication System
- ✅ **Google Sign-In** (OAuth 2.0)
- ✅ **Email/Password Authentication**
- ✅ **Protected Routes**
- ✅ **User Dashboard**
- ✅ **Session Management**
- ✅ **Firebase Authentication**

### Application Features
- 🎨 Premium dark theme with yellow accents
- 📱 Fully responsive design
- 🛡️ Secure authentication flow
- 👤 User profile management
- 🔐 Role-based access control ready
- 🎯 Modern glassmorphism UI
- ⚡ Fast performance with Vite
- 🎭 Smooth animations and transitions

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Firebase account with project created

### Installation

1. **Clone and Install Dependencies**
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

2. **Configure Firebase** (See [QUICK_START.md](QUICK_START.md))
   - Enable Google Sign-In in Firebase Console
   - Download service account key for backend

3. **Start Development Servers**

**Frontend:**
```bash
npm run dev
```

**Backend:**
```bash
cd backend
npm run dev
```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - 1-minute setup guide
- **[AUTH_SETUP_GUIDE.md](AUTH_SETUP_GUIDE.md)** - Complete authentication documentation
- **[USAGE_EXAMPLES.js](USAGE_EXAMPLES.js)** - Code examples
- **[backend/README.md](backend/README.md)** - Backend API documentation

## 🏗️ Project Structure

```
Glaze369 an/
├── src/
│   ├── config/          # Firebase configuration
│   ├── context/         # React contexts (Auth, Cart)
│   ├── components/      # Reusable components
│   ├── pages/           # Page components
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── Dashboard.jsx
│   ├── services/        # API services
│   └── styles/          # CSS stylesheets
├── backend/
│   ├── server.js        # Express server
│   └── package.json     # Backend dependencies
└── package.json         # Frontend dependencies
```

## 🎯 Available Routes

### Public Routes
- `/` - Home
- `/login` - Login page
- `/signup` - Signup page
- `/services` - Services
- `/products` - Products
- `/gallery` - Gallery
- `/about` - About
- `/contact` - Contact

### Protected Routes (Login Required)
- `/dashboard` - User dashboard
- `/booking` - Service booking
- `/cart` - Shopping cart
- `/checkout` - Checkout
- `/admin/*` - Admin panel

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Firebase Auth** - Authentication
- **CSS3** - Styling with modern features

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Firebase Admin SDK** - Backend authentication
- **CORS** - Cross-origin support

## 🎨 Design System

- **Primary Color:** Yellow (#ffc107)
- **Background:** Dark gradients (#0a0a0a to #1a1a1a)
- **Theme:** Dark mode with glassmorphism
- **Typography:** System fonts with modern styling
- **Animations:** Smooth transitions and micro-interactions

## 🔐 Security Features

- Firebase Authentication
- JWT token verification
- Protected API endpoints
- Secure session management
- CORS configuration
- Environment variable protection

## 📝 Scripts

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend
```bash
npm start        # Start production server
npm run dev      # Start development server with nodemon
```

## 🤝 Contributing

This is a private project for Glaze369 Car Detailing.

## 📄 License

ISC

## 🆘 Support

For setup help, see:
1. [QUICK_START.md](QUICK_START.md) - Quick setup
2. [AUTH_SETUP_GUIDE.md](AUTH_SETUP_GUIDE.md) - Detailed guide
3. Check console logs for errors
4. Review Firebase Console settings

---

**Built with ❤️ for Glaze369 Car Detailing**
