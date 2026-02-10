# Glaze369 Car Detailing - Authentication Setup Guide

Complete authentication system with Google Sign-In using Firebase Authentication.

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- Firebase project created

---

## 📦 Frontend Setup

### 1. Install Dependencies
```bash
npm install
```

The required Firebase package will be installed automatically.

### 2. Configure Environment Variables
The `.env` file is already created with:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Firebase Console Setup (Important!)

**Enable Google Authentication:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **glaze-369**
3. Navigate to **Authentication** > **Sign-in method**
4. Click on **Google** provider
5. Click **Enable**
6. Add your support email
7. Click **Save**

**Configure Authorized Domains:**

1. In Authentication settings, go to **Settings** tab
2. Scroll to **Authorized domains**
3. Add your domains:
   - `localhost` (already added by default)
   - Your production domain (when deploying)

### 4. Start Frontend Development Server
```bash
npm run dev
```

The app will run on `http://localhost:5173` (or similar Vite port)

---

## 🔧 Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Get Firebase Service Account Key

This is the most important step for the backend!

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **glaze-369**
3. Click the gear icon ⚙️ > **Project Settings**
4. Navigate to the **Service Accounts** tab
5. Click **Generate New Private Key**
6. Click **Generate Key** in the popup
7. A JSON file will download automatically
8. Rename it to `serviceAccountKey.json`
9. Move it to the `backend` directory

**⚠️ SECURITY WARNING:**
- Never commit `serviceAccountKey.json` to version control!
- It's already added to `.gitignore`
- Keep this file secure!

### 4. Verify Environment Variables
The backend `.env` file is already configured with:
```env
PORT=5000
NODE_ENV=development
```

### 5. Start Backend Server

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The server will run on `http://localhost:5000`

---

## 🎯 Testing the Authentication Flow

### 1. Test Google Sign-In
1. Open `http://localhost:5173/login`
2. Click "Continue with Google"
3. Select your Google account
4. You should be redirected to the dashboard

### 2. Test Email/Password Sign-Up
1. Open `http://localhost:5173/signup`
2. Enter email and password
3. Click "Sign Up"
4. You should be redirected to the dashboard

### 3. Test Protected Routes
- Try accessing `/dashboard` without logging in
- You should be redirected to `/login`
- After logging in, you can access the dashboard

### 4. Test Backend API
Open your browser or use curl/Postman:

**Health Check:**
```bash
curl http://localhost:5000/api/health
```

**Get User Profile (requires authentication):**
1. Login to the app
2. Open browser DevTools > Console
3. Run:
```javascript
const user = firebase.auth().currentUser;
const token = await user.getIdToken();
console.log(token);
```
4. Use the token in API requests:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" http://localhost:5000/api/user/profile
```

---

## 📁 Project Structure

```
Glaze369 an/
├── src/
│   ├── config/
│   │   └── firebase.js              # Firebase configuration
│   ├── context/
│   │   ├── AuthContext.jsx          # Authentication context
│   │   └── CartContext.jsx          # Existing cart context
│   ├── components/
│   │   └── ProtectedRoute.jsx       # Route protection component
│   ├── pages/
│   │   ├── Login.jsx                # Login page
│   │   ├── Signup.jsx               # Signup page
│   │   └── Dashboard.jsx            # User dashboard
│   ├── services/
│   │   └── apiService.js            # API service utilities
│   ├── styles/
│   │   ├── Auth.css                 # Auth pages styling
│   │   └── Dashboard.css            # Dashboard styling
│   └── App.jsx                      # Main app with routes
├── backend/
│   ├── server.js                    # Express server
│   ├── package.json                 # Backend dependencies
│   ├── .env                         # Environment variables
│   ├── .gitignore                   # Git ignore rules
│   ├── serviceAccountKey.json       # Firebase Admin SDK key (download this!)
│   └── README.md                    # Backend documentation
└── .env                             # Frontend environment variables
```

---

## 🔐 Authentication Features

### Frontend Features
- ✅ Google Sign-In (OAuth)
- ✅ Email/Password Sign-Up
- ✅ Email/Password Login
- ✅ Protected Routes
- ✅ User Context Management
- ✅ Automatic Token Refresh
- ✅ Error Handling
- ✅ Loading States
- ✅ Premium UI/UX Design

### Backend Features
- ✅ Firebase Admin SDK Integration
- ✅ Token Verification Middleware
- ✅ User Profile Management
- ✅ User Account Deletion
- ✅ Custom Claims Support
- ✅ Admin Endpoints
- ✅ CORS Configuration
- ✅ Error Handling

---

## 🎨 UI/UX Highlights

- **Dark Theme** with yellow accents matching your brand
- **Glassmorphism** effects for modern look
- **Smooth Animations** for better UX
- **Responsive Design** for all devices
- **Google Brand Guidelines** compliant button
- **Premium Styling** with gradients and shadows

---

## 🔗 Available Routes

### Public Routes
- `/` - Home page
- `/login` - Login page
- `/signup` - Signup page
- `/services` - Services page
- `/products` - Products page
- `/gallery` - Gallery page
- `/about` - About page
- `/contact` - Contact page

### Protected Routes (Require Login)
- `/dashboard` - User dashboard
- `/booking` - Service booking
- `/cart` - Shopping cart
- `/checkout` - Checkout
- `/admin/*` - Admin pages

---

## 🌐 API Endpoints

See `backend/README.md` for complete API documentation.

### Key Endpoints:
- `GET /api/health` - Health check
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `DELETE /api/user/account` - Delete account
- `GET /api/admin/users` - Get all users (admin)

---

## 🐛 Troubleshooting

### Firebase Errors

**"Firebase: Error (auth/popup-closed-by-user)"**
- User closed the Google Sign-In popup
- Normal behavior, no action needed

**"Firebase: Error (auth/configuration-not-found)"**
- Google Sign-In not enabled in Firebase Console
- Follow step 3 in Frontend Setup

**"Firebase: Error (auth/unauthorized-domain)"**
- Domain not authorized in Firebase Console
- Add your domain to authorized domains

### Backend Errors

**"Error initializing Firebase Admin"**
- `serviceAccountKey.json` is missing or invalid
- Download the key from Firebase Console

**"No such file or directory: serviceAccountKey.json"**
- File not in the backend directory
- Make sure it's named exactly `serviceAccountKey.json`

**CORS Errors**
- Backend not running
- Check CORS configuration in `server.js`

---

## 📚 Next Steps

1. **Customize the Dashboard** - Add more features to the user dashboard
2. **Add User Roles** - Implement admin roles using custom claims
3. **Email Verification** - Add email verification flow
4. **Password Reset** - Implement forgot password functionality
5. **Social Auth** - Add more providers (Facebook, GitHub, etc.)
6. **Profile Management** - Allow users to update their profile
7. **Session Management** - Add remember me functionality
8. **Security Rules** - Configure Firebase security rules
9. **Analytics** - Add Google Analytics or Firebase Analytics
10. **Deploy** - Deploy to production (Vercel, Netlify, etc.)

---

## 📝 Important Notes

1. **Service Account Key**: Keep `serviceAccountKey.json` secure and never commit it
2. **Environment Variables**: Configure for production before deploying
3. **CORS**: Update CORS settings for production domains
4. **Rate Limiting**: Add rate limiting for production
5. **Input Validation**: Add proper validation for production use
6. **Error Logging**: Implement proper error logging for production

---

## 🆘 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review Firebase Console settings
3. Check browser console for errors
4. Review server logs for backend errors
5. Ensure all dependencies are installed

---

## 📄 License

ISC

---

**Happy Coding! 🚗✨**
