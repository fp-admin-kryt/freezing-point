# Freezing Point AI

An ultra-modern, dark, space-themed AI newsletter platform built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern Design**: Dark space theme with glassmorphism effects
- **Interactive Animations**: Smooth entrance animations and scroll effects
- **Content Management**: Admin panel for managing research, signals, and observer posts
- **Responsive Design**: Works perfectly on all devices
- **Real-time Search**: Advanced filtering and search capabilities
- **Horizontal Scrolling**: Smooth horizontal scroll for content sections

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **File Upload**: React Dropzone
- **Notifications**: React Hot Toast

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd freezingpoint-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Design System

### Colors
- `space-black`: #0a0a0a
- `space-gray`: #1a1a1a
- `cobalt-blue`: #136fd7
- `cobalt-light`: #4da6ff
- `glass`: rgba(255, 255, 255, 0.05)
- `glass-border`: rgba(255, 255, 255, 0.1)

### Fonts
- **Montserrat**: Primary font for headings
- **Montserrat Alternates**: Navigation and special elements

### Animations
- Entrance animations with staggered delays
- Smooth scroll transitions
- Hover effects with glassmorphism
- Interactive card animations

## 🏗️ Project Structure

```
freezingpoint-ai/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin panel pages
│   ├── about/             # About page
│   ├── research/          # Research page
│   ├── radar/             # Radar page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── not-found.tsx      # 404 page
├── components/            # React components
│   ├── admin/            # Admin panel components
│   ├── Navigation.tsx    # Navigation bar
│   ├── ScrollIndicator.tsx
│   └── InteractiveCard.tsx
├── lib/                  # Utility functions
│   └── dataStore.ts      # In-memory data store
├── public/               # Static assets
│   └── assets/logos/     # Logo files
└── package.json
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Firebase Configuration (for production)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Cloudinary Configuration (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin Password
ADMIN_PASSWORD=your_secure_password
```

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - Free)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Import your repository
   - Vercel will automatically detect Next.js and deploy

3. **Add Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add all variables from `.env.local`

### Option 2: Netlify (Free)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `out` folder (after `npm run export`)
   - Or connect your GitHub repository

### Option 3: Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Firebase**
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Build and deploy**
   ```bash
   npm run build
   firebase deploy
   ```

## 🔥 Firebase Integration (Recommended)

### 1. Set up Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Authentication, Firestore, and Storage

### 2. Install Firebase SDK
```bash
npm install firebase
```

### 3. Create Firebase Config
Create `lib/firebase.ts`:
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### 4. Update Data Store
Replace `lib/dataStore.ts` with Firebase integration for real-time data persistence.

## ☁️ Cloudinary Integration (For Images)

### 1. Set up Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com)
2. Create a free account
3. Get your cloud name, API key, and secret

### 2. Install Cloudinary SDK
```bash
npm install cloudinary next-cloudinary
```

### 3. Create Upload API Route
Create `app/api/upload/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file);
    
    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
```

## 🔐 Security

- Admin panel is password-protected
- Environment variables for sensitive data
- Input validation with Zod
- File upload restrictions

## 📱 Responsive Design

The website is fully responsive with:
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interactions
- Optimized for all screen sizes

## 🎯 Performance

- Next.js 14 App Router for optimal performance
- Image optimization with Next.js Image component
- Lazy loading for components
- Optimized animations with Framer Motion
- Minimal bundle size

## 🔄 Development Workflow

1. **Local Development**
   ```bash
   npm run dev
   ```

2. **Build for Production**
   ```bash
   npm run build
   ```

3. **Preview Production Build**
   ```bash
   npm run start
   ```

4. **Lint and Type Check**
   ```bash
   npm run lint
   npm run type-check
   ```

## 🚀 Quick Deployment Checklist

- [ ] Push code to GitHub
- [ ] Set up Vercel/Netlify account
- [ ] Connect repository
- [ ] Add environment variables
- [ ] Set up custom domain (optional)
- [ ] Test all functionality
- [ ] Monitor performance

## 🆘 Troubleshooting

### Common Issues

1. **Build Errors**
   - Check TypeScript errors: `npm run type-check`
   - Verify all imports are correct
   - Ensure all dependencies are installed

2. **Environment Variables**
   - Make sure `.env.local` is in root directory
   - Restart development server after adding variables
   - Check variable names match exactly

3. **Image Upload Issues**
   - Verify Cloudinary credentials
   - Check file size limits
   - Ensure proper CORS configuration

4. **Admin Panel Access**
   - Default password: `freezingpoint2024`
   - Change password in environment variables
   - Clear browser cache if login issues persist

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the code comments
3. Create an issue in the repository
4. Contact the development team

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for Freezing Point AI** 