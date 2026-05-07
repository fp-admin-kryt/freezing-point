'use client'

import { initializeApp, getApps } from 'firebase/app';
import { initializeFirestore, collection, addDoc, getDocs, getDoc, setDoc, doc, deleteDoc, updateDoc, query, orderBy, increment } from 'firebase/firestore';
import { getStorage, ref as storageRef, deleteObject } from 'firebase/storage';
import { deleteFromCloudinary, deleteMultipleFromCloudinary } from './cloudinary';
import { uploadPdfToSupabase, deletePdfFromSupabase } from './supabase';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase only if it hasn't been initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore with client-only long-polling tweaks. On the server (SSR/prerender), use defaults.
// See: https://firebase.google.com/docs/firestore/troubleshoot#web-channel-errors
export const db = typeof window === 'undefined'
  ? initializeFirestore(app, { ignoreUndefinedProperties: true })
  : initializeFirestore(app, { experimentalAutoDetectLongPolling: true, ignoreUndefinedProperties: true });
export const auth = getAuth(app);
export const storage = getStorage(app);

export const uploadPdfToStorage = (file: File, postSlug: string): Promise<string> =>
  uploadPdfToSupabase(file, postSlug)

export const incrementViewCount = async (collectionName: string, id: string): Promise<void> => {
  try {
    await updateDoc(doc(db, collectionName, id), { viewCount: increment(1) })
  } catch { /* silent — never block page render */ }
}

export const incrementDownloadCount = async (id: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'research', id), { downloadCount: increment(1) })
  } catch { /* silent */ }
}

export const incrementHomepageViews = async (): Promise<void> => {
  try {
    await setDoc(doc(db, 'analytics', 'homepage'), { viewCount: increment(1) }, { merge: true })
  } catch { /* silent */ }
}

export const getHomepageViews = async (): Promise<number> => {
  try {
    const snap = await getDoc(doc(db, 'analytics', 'homepage'))
    return snap.exists() ? (snap.data().viewCount ?? 0) : 0
  } catch { return 0 }
}

const deleteFromStorage = async (url: string): Promise<void> => {
  try {
    const match = url.match(/\/o\/([^?]+)/)
    if (!match) return
    const path = decodeURIComponent(match[1])
    await deleteObject(storageRef(storage, path))
  } catch (err) {
    console.warn('Firebase Storage delete skipped:', err)
  }
}

export default app;
// Utility: remove undefined values to keep Firestore writes clean
const sanitize = <T extends Record<string, any>>(obj: T): T => {
  const copy: Record<string, any> = {}
  for (const key of Object.keys(obj)) {
    const value = (obj as any)[key]
    if (value !== undefined) copy[key] = value
  }
  return copy as T
}

// Retry helper for transient network/WebChannel errors
const withRetry = async <T>(fn: () => Promise<T>, attempts = 3): Promise<T> => {
  let lastErr: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (e) {
      lastErr = e
      await new Promise((r) => setTimeout(r, 500 * (i + 1)))
    }
  }
  throw lastErr
}

// Types
export type TemplateType = 'singleImage' | 'document' | 'default';

export interface GridCell {
  header: string;
  title: string;
  content: string;
}

export interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'imageText' | 'sectionLabel' | 'documentTitle' | 'subtitle' | 'heading1' | 'heading2' | 'pullQuote' | 'grid';
  content?: string; // HTML for 'text'; plain text for all others
  imageUrl?: string;
  align?: 'left' | 'right' | 'full'; // For imageText blocks
  cells?: GridCell[]; // For grid blocks
  order: number;
}

export interface ResearchPost {
  id?: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  tags: string[];
  imageUrl?: string;
  whitepaperUrl?: string;
  abstract?: string;
  previewBody?: string;
  templateType?: TemplateType;
  blocks?: ContentBlock[];
  richContent?: string;
  defaultContent?: string;
  image2Url?: string;
  image3Url?: string;
  createdAt: Date;
  viewCount?: number;
  downloadCount?: number;
}

export interface RadarPost {
  id?: string;
  heading: string;
  content: string;
  tags: string[];
  domain: string;
  imageUrl?: string;
  templateType?: TemplateType;
  blocks?: ContentBlock[];
  richContent?: string;
  defaultContent?: string;
  image2Url?: string;
  image3Url?: string;
  date: string;
  createdAt: Date;
  viewCount?: number;
}

export interface SignalPost {
  id?: string;
  heading: string;
  content: string;
  tags: string[];
  domain: string;
  imageUrl?: string;
  templateType?: TemplateType;
  blocks?: ContentBlock[];
  richContent?: string;
  defaultContent?: string;
  image2Url?: string;
  image3Url?: string;
  date: string;
  createdAt: Date;
  viewCount?: number;
}

export interface ObserverPost {
  id?: string;
  heading: string;
  content: string;
  tags: string[];
  domain: string;
  imageUrl?: string;
  templateType?: TemplateType;
  blocks?: ContentBlock[];
  richContent?: string;
  defaultContent?: string;
  image2Url?: string;
  image3Url?: string;
  date: string;
  createdAt: Date;
  viewCount?: number;
}

export interface Tag {
  id?: string;
  name: string;
  color: string;
  imageUrl?: string;
}

export interface Domain {
  id?: string;
  name: string;
  description?: string;
  color?: string; // optional color support for UI
}

// Research Posts
export const saveResearchPost = async (post: Omit<ResearchPost, 'id' | 'createdAt'>, slug: string): Promise<string> => {
  try {
    const docRef = doc(db, 'research', slug);
    await withRetry(() => setDoc(docRef, sanitize({ ...post, createdAt: new Date() })));
    console.log('Research post saved with ID:', slug);
    return slug;
  } catch (error) {
    console.error('Error saving research post:', error);
    throw error;
  }
};

export const getResearchPosts = async (): Promise<ResearchPost[]> => {
  try {
    const q = query(collection(db, 'research'), orderBy('createdAt', 'desc'));
    const querySnapshot = await withRetry(() => getDocs(q));
    const posts: ResearchPost[] = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() } as ResearchPost);
    });
    return posts;
  } catch (error) {
    console.error('Error getting research posts:', error);
    return [];
  }
};

export const deleteResearchPost = async (id: string): Promise<void> => {
  try {
    // First, get the post to extract image URLs
    const postRef = doc(db, 'research', id);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      const postData = postSnap.data() as ResearchPost;
      const urlsToDelete: string[] = [];

      // Collect all asset URLs
      if (postData.imageUrl) urlsToDelete.push(postData.imageUrl);
      if (postData.whitepaperUrl) urlsToDelete.push(postData.whitepaperUrl);

      // Collect image URLs from blocks if document template
      if (postData.blocks) {
        postData.blocks.forEach(block => {
          if (block.imageUrl) urlsToDelete.push(block.imageUrl);
        });
      }

      const cloudinaryUrls = urlsToDelete.filter(u => u.includes('res.cloudinary.com'))
      const firebaseUrls = urlsToDelete.filter(u => u.includes('firebasestorage.googleapis.com'))
      const supabaseUrls = urlsToDelete.filter(u => u.includes('supabase.co'))
      if (cloudinaryUrls.length > 0) await deleteMultipleFromCloudinary(cloudinaryUrls)
      await Promise.all(firebaseUrls.map(deleteFromStorage))
      await Promise.all(supabaseUrls.map(deletePdfFromSupabase))
    }

    // Delete from Firestore
    await withRetry(() => deleteDoc(doc(db, 'research', id)));
    console.log('Research post deleted:', id);
  } catch (error) {
    console.error('Error deleting research post:', error);
    throw error;
  }
};

// Signal Posts
export const saveSignalPost = async (post: Omit<SignalPost, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await withRetry(() => addDoc(collection(db, 'signals'), sanitize({
      ...post,
      createdAt: new Date()
    })));
    console.log('Signal post saved with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving signal post:', error);
    throw error;
  }
};

export const getSignalPosts = async (): Promise<SignalPost[]> => {
  try {
    const q = query(collection(db, 'signals'), orderBy('createdAt', 'desc'));
    const querySnapshot = await withRetry(() => getDocs(q));
    const posts: SignalPost[] = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() } as SignalPost);
    });
    return posts;
  } catch (error) {
    console.error('Error getting signal posts:', error);
    return [];
  }
};

export const deleteSignalPost = async (id: string): Promise<void> => {
  try {
    // First, get the post to extract image URLs
    const postRef = doc(db, 'signals', id);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      const postData = postSnap.data() as SignalPost;
      const urlsToDelete: string[] = [];

      // Collect all image URLs
      if (postData.imageUrl) urlsToDelete.push(postData.imageUrl);

      // Collect image URLs from blocks if document template
      if (postData.blocks) {
        postData.blocks.forEach(block => {
          if (block.imageUrl) urlsToDelete.push(block.imageUrl);
        });
      }

      // Delete from Cloudinary
      if (urlsToDelete.length > 0) {
        await deleteMultipleFromCloudinary(urlsToDelete);
      }
    }

    // Delete from Firebase
    await withRetry(() => deleteDoc(doc(db, 'signals', id)));
    console.log('Signal post deleted:', id);
  } catch (error) {
    console.error('Error deleting signal post:', error);
    throw error;
  }
};

// Observer Posts
export const saveObserverPost = async (post: Omit<ObserverPost, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await withRetry(() => addDoc(collection(db, 'observers'), sanitize({
      ...post,
      createdAt: new Date()
    })));
    console.log('Observer post saved with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving observer post:', error);
    throw error;
  }
};

export const getObserverPosts = async (): Promise<ObserverPost[]> => {
  try {
    const q = query(collection(db, 'observers'), orderBy('createdAt', 'desc'));
    const querySnapshot = await withRetry(() => getDocs(q));
    const posts: ObserverPost[] = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() } as ObserverPost);
    });
    return posts;
  } catch (error) {
    console.error('Error getting observer posts:', error);
    return [];
  }
};

export const deleteObserverPost = async (id: string): Promise<void> => {
  try {
    // First, get the post to extract image URLs
    const postRef = doc(db, 'observers', id);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      const postData = postSnap.data() as ObserverPost;
      const urlsToDelete: string[] = [];

      // Collect all image URLs
      if (postData.imageUrl) urlsToDelete.push(postData.imageUrl);

      // Collect image URLs from blocks if document template
      if (postData.blocks) {
        postData.blocks.forEach(block => {
          if (block.imageUrl) urlsToDelete.push(block.imageUrl);
        });
      }

      // Delete from Cloudinary
      if (urlsToDelete.length > 0) {
        await deleteMultipleFromCloudinary(urlsToDelete);
      }
    }

    // Delete from Firebase
    await withRetry(() => deleteDoc(doc(db, 'observers', id)));
    console.log('Observer post deleted:', id);
  } catch (error) {
    console.error('Error deleting observer post:', error);
    throw error;
  }
};

// Radar Posts
export const saveRadarPost = async (post: Omit<RadarPost, 'id' | 'createdAt'>, slug: string): Promise<string> => {
  try {
    const docRef = doc(db, 'radar', slug);
    await withRetry(() => setDoc(docRef, sanitize({ ...post, createdAt: new Date() })));
    return slug;
  } catch (error) {
    console.error('Error saving radar post:', error);
    throw error;
  }
};

export const getRadarPosts = async (): Promise<RadarPost[]> => {
  try {
    const q = query(collection(db, 'radar'), orderBy('createdAt', 'desc'));
    const querySnapshot = await withRetry(() => getDocs(q));
    const posts: RadarPost[] = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() } as RadarPost);
    });
    return posts;
  } catch (error) {
    console.error('Error getting radar posts:', error);
    return [];
  }
};

export const deleteRadarPost = async (id: string): Promise<void> => {
  try {
    const postRef = doc(db, 'radar', id);
    const postSnap = await getDoc(postRef);
    if (postSnap.exists()) {
      const postData = postSnap.data() as RadarPost;
      const urlsToDelete: string[] = [];
      if (postData.imageUrl) urlsToDelete.push(postData.imageUrl);
      if (postData.blocks) {
        postData.blocks.forEach((block) => {
          if (block.imageUrl) urlsToDelete.push(block.imageUrl);
        });
      }
      if (urlsToDelete.length > 0) {
        await deleteMultipleFromCloudinary(urlsToDelete);
      }
    }
    await withRetry(() => deleteDoc(doc(db, 'radar', id)));
  } catch (error) {
    console.error('Error deleting radar post:', error);
    throw error;
  }
};

// Tags
export const saveTag = async (tag: Omit<Tag, 'id'>): Promise<string> => {
  try {
    const docRef = await withRetry(() => addDoc(collection(db, 'tags'), sanitize(tag)));
    console.log('Tag saved with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving tag:', error);
    throw error;
  }
};

export const updateTag = async (id: string, data: Partial<Tag>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'tags', id), data);
    console.log('Tag updated:', id);
  } catch (error) {
    console.error('Error updating tag:', error);
    throw error;
  }
};

export const getTags = async (): Promise<Tag[]> => {
  try {
    const querySnapshot = await withRetry(() => getDocs(collection(db, 'tags')));
    const tags: Tag[] = [];
    querySnapshot.forEach((doc) => {
      tags.push({ id: doc.id, ...doc.data() } as Tag);
    });
    return tags;
  } catch (error) {
    console.error('Error getting tags:', error);
    return [];
  }
};

export const deleteTag = async (id: string): Promise<void> => {
  try {
    // First, get the tag to extract image URL
    const tagRef = doc(db, 'tags', id);
    const tagSnap = await getDoc(tagRef);

    if (tagSnap.exists()) {
      const tagData = tagSnap.data() as Tag;

      // Delete image from Cloudinary if exists
      if (tagData.imageUrl) {
        await deleteFromCloudinary(tagData.imageUrl);
      }
    }

    // Delete from Firebase
    await withRetry(() => deleteDoc(doc(db, 'tags', id)));
    console.log('Tag deleted:', id);
  } catch (error) {
    console.error('Error deleting tag:', error);
    throw error;
  }
};

// Domains
export const saveDomain = async (domain: Omit<Domain, 'id'>): Promise<string> => {
  try {
    const docRef = await withRetry(() => addDoc(collection(db, 'domains'), sanitize(domain)));
    console.log('Domain saved with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving domain:', error);
    throw error;
  }
};

export const getDomains = async (): Promise<Domain[]> => {
  try {
    const querySnapshot = await withRetry(() => getDocs(collection(db, 'domains')));
    const domains: Domain[] = [];
    querySnapshot.forEach((doc) => {
      domains.push({ id: doc.id, ...doc.data() } as Domain);
    });
    return domains;
  } catch (error) {
    console.error('Error getting domains:', error);
    return [];
  }
};

export const deleteDomain = async (id: string): Promise<void> => {
  try {
    await withRetry(() => deleteDoc(doc(db, 'domains', id)));
    console.log('Domain deleted:', id);
  } catch (error) {
    console.error('Error deleting domain:', error);
    throw error;
  }
};

export const updateDomain = async (id: string, data: Partial<Domain>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'domains', id), data);
    console.log('Domain updated:', id);
  } catch (error) {
    console.error('Error updating domain:', error);
    throw error;
  }
};

// Typography Settings
export interface TypographyStyleConfig {
  fontSize: { desktop: string; mobile: string };
  fontWeight: string;
  color: string;
  lineHeight: string;
  fontFamily?: string;
  htmlElement?: string;
  letterSpacing?: string;
}

export interface TypographySettings {
  id?: string;
  heading1: TypographyStyleConfig;
  heading2: TypographyStyleConfig;
  heading3: TypographyStyleConfig;
  body: TypographyStyleConfig;
  caption: TypographyStyleConfig;
  updatedAt?: Date;
}

export const getTypographySettings = async (): Promise<TypographySettings | null> => {
  try {
    const settingsRef = doc(db, 'settings', 'typography');
    const settingsSnap = await getDoc(settingsRef);
    if (settingsSnap.exists()) {
      return { id: settingsSnap.id, ...settingsSnap.data() } as TypographySettings;
    }
    return null;
  } catch (error) {
    console.error('Error getting typography settings:', error);
    return null;
  }
};

export const saveTypographySettings = async (settings: Omit<TypographySettings, 'id' | 'updatedAt'>): Promise<void> => {
  try {
    const settingsRef = doc(db, 'settings', 'typography');
    await setDoc(settingsRef, {
      ...settings,
      updatedAt: new Date()
    }, { merge: true });
    console.log('Typography settings saved');
  } catch (error) {
    console.error('Error saving typography settings:', error);
    throw error;
  }
};
