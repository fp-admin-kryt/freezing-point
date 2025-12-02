'use client'

import { initializeApp, getApps } from 'firebase/app';
import { initializeFirestore, collection, addDoc, getDocs, getDoc, setDoc, doc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { deleteFromCloudinary, deleteMultipleFromCloudinary } from './cloudinary';
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
export type TemplateType = 'singleImage' | 'document';

export interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'imageText';
  content?: string; // HTML content for text blocks
  imageUrl?: string;
  align?: 'left' | 'right' | 'full'; // For imageText blocks
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
  templateType?: TemplateType;
  blocks?: ContentBlock[]; // For document template
  richContent?: string; // HTML content for single image template
  createdAt: Date;
}

export interface SignalPost {
  id?: string;
  heading: string;
  content: string;
  tags: string[];
  domain: string;
  imageUrl?: string;
  templateType?: TemplateType;
  blocks?: ContentBlock[]; // For document template
  richContent?: string; // HTML content for single image template
  date: string;
  createdAt: Date;
}

export interface ObserverPost {
  id?: string;
  heading: string;
  content: string;
  tags: string[];
  domain: string;
  imageUrl?: string;
  templateType?: TemplateType;
  blocks?: ContentBlock[]; // For document template
  richContent?: string; // HTML content for single image template
  date: string;
  createdAt: Date;
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
export const saveResearchPost = async (post: Omit<ResearchPost, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await withRetry(() => addDoc(collection(db, 'research'), sanitize({
      ...post,
      createdAt: new Date()
    })));
    console.log('Research post saved with ID:', docRef.id);
    return docRef.id;
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
      
      // Collect all image URLs
      if (postData.imageUrl) urlsToDelete.push(postData.imageUrl);
      if (postData.whitepaperUrl) urlsToDelete.push(postData.whitepaperUrl);
      
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
export interface TypographySettings {
  id?: string;
  heading1: {
    fontSize: { desktop: string; mobile: string };
    fontWeight: string;
    color: string;
    lineHeight: string;
  };
  heading2: {
    fontSize: { desktop: string; mobile: string };
    fontWeight: string;
    color: string;
    lineHeight: string;
  };
  heading3: {
    fontSize: { desktop: string; mobile: string };
    fontWeight: string;
    color: string;
    lineHeight: string;
  };
  body: {
    fontSize: { desktop: string; mobile: string };
    fontWeight: string;
    color: string;
    lineHeight: string;
  };
  caption: {
    fontSize: { desktop: string; mobile: string };
    fontWeight: string;
    color: string;
    lineHeight: string;
  };
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
