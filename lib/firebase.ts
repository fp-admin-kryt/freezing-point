'use client'

import { initializeApp, getApps } from 'firebase/app';
import { initializeFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';
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
  ? initializeFirestore(app, {})
  : initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
export const auth = getAuth(app);

export default app;

// Types
export interface ResearchPost {
  id?: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  tags: string[];
  imageUrl?: string;
  whitepaperUrl?: string;
  createdAt: Date;
}

export interface SignalPost {
  id?: string;
  heading: string;
  content: string;
  tags: string[];
  domain: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface ObserverPost {
  id?: string;
  heading: string;
  content: string;
  tags: string[];
  domain: string;
  imageUrl?: string;
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
    const docRef = await addDoc(collection(db, 'research'), {
      ...post,
      createdAt: new Date()
    });
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
    const querySnapshot = await getDocs(q);
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
    await deleteDoc(doc(db, 'research', id));
    console.log('Research post deleted:', id);
  } catch (error) {
    console.error('Error deleting research post:', error);
    throw error;
  }
};

// Signal Posts
export const saveSignalPost = async (post: Omit<SignalPost, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'signals'), {
      ...post,
      createdAt: new Date()
    });
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
    const querySnapshot = await getDocs(q);
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
    await deleteDoc(doc(db, 'signals', id));
    console.log('Signal post deleted:', id);
  } catch (error) {
    console.error('Error deleting signal post:', error);
    throw error;
  }
};

// Observer Posts
export const saveObserverPost = async (post: Omit<ObserverPost, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'observers'), {
      ...post,
      createdAt: new Date()
    });
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
    const querySnapshot = await getDocs(q);
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
    await deleteDoc(doc(db, 'observers', id));
    console.log('Observer post deleted:', id);
  } catch (error) {
    console.error('Error deleting observer post:', error);
    throw error;
  }
};

// Tags
export const saveTag = async (tag: Omit<Tag, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'tags'), tag);
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
    const querySnapshot = await getDocs(collection(db, 'tags'));
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
    await deleteDoc(doc(db, 'tags', id));
    console.log('Tag deleted:', id);
  } catch (error) {
    console.error('Error deleting tag:', error);
    throw error;
  }
};

// Domains
export const saveDomain = async (domain: Omit<Domain, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'domains'), domain);
    console.log('Domain saved with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving domain:', error);
    throw error;
  }
};

export const getDomains = async (): Promise<Domain[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'domains'));
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
    await deleteDoc(doc(db, 'domains', id));
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
