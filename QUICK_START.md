# Quick Start - Authentication System

## ⚡ 1-Minute Setup

### Step 1: Enable Google Sign-In in Firebase Console
1. Visit: https://console.firebase.google.com/
2. Select project: **glaze-369**
3. Go to **Authentication** → **Sign-in method**
4. Click **Google** → **Enable** → **Save**

### Step 2: Download Service Account Key
1. In Firebase Console: **Settings** (⚙️) → **Project Settings**
2. **Service Accounts** tab
3. Click **Generate New Private Key**
4. Save as `backend/serviceAccountKey.json`

### Step 3: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm install
npm run dev
```

### Step 4: Test It!
1. Open http://localhost:5173/login
2. Click "Continue with Google"
3. Sign in with your Google account
4. You're in! 🎉

---

## 📋 What You Get

✅ **Frontend:**
- Login page at `/login`
- Signup page at `/signup`
- User dashboard at `/dashboard`
- Protected routes
- Google Sign-In
- Email/Password authentication

✅ **Backend:**
- Express server on `http://localhost:5000`
- Firebase Admin SDK integration
- User authentication endpoints
- Profile management API
- Token verification

---

## 🎯 Test Pages

- Login: http://localhost:5173/login
- Signup: http://localhost:5173/signup
- Dashboard: http://localhost:5173/dashboard (requires login)

---

## 🆘 Common Issues

**"serviceAccountKey.json not found"**
→ Download it from Firebase Console (see Step 2 above)

**"Google Sign-In not available"**
→ Enable it in Firebase Console (see Step 1 above)

**Backend not starting?**
→ Make sure you ran `npm install` in the backend directory

---

For detailed documentation, see `AUTH_SETUP_GUIDE.md`
