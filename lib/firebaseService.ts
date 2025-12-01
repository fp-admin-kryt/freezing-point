'use client'

import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query,
  orderBy,
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Types
export interface Tag {
  id: string;
  name: string;
  color: string;
  imageUrl?: string;
}

export interface Domain {
  id: string;
  name: string;
  description: string;
  color: string;
  postCount: number;
}

export interface ResearchPost {
  id: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  imageUrl?: string;
  whitepaperUrl?: string;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SignalPost {
  id: string;
  heading: string;
  content: string;
  imageUrl?: string;
  tags: string[];
  domain: string;
  date: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ObserverPost {
  id: string;
  heading: string;
  content: string;
  imageUrl?: string;
  tags: string[];
  domain: string;
  date: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Tag operations
export const addTag = async (tag: Omit<Tag, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'tags'), {
    ...tag,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

export const getTags = async (): Promise<Tag[]> => {
  const querySnapshot = await getDocs(collection(db, 'tags'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Tag));
};

export const updateTag = async (id: string, data: Partial<Tag>): Promise<void> => {
  const docRef = doc(db, 'tags', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now()
  });
};

export const deleteTag = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'tags', id));
};

// Domain operations
export const addDomain = async (domain: Omit<Domain, 'id' | 'postCount'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'domains'), {
    ...domain,
    postCount: 0,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

export const getDomains = async (): Promise<Domain[]> => {
  const querySnapshot = await getDocs(collection(db, 'domains'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Domain));
};

export const updateDomain = async (id: string, data: Partial<Domain>): Promise<void> => {
  const docRef = doc(db, 'domains', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now()
  });
};

export const deleteDomain = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'domains', id));
};

// Research Post operations
export const addResearchPost = async (post: Omit<ResearchPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'research'), {
    ...post,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return docRef.id;
};

export const getResearchPosts = async (): Promise<ResearchPost[]> => {
  const q = query(collection(db, 'research'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as ResearchPost));
};

export const updateResearchPost = async (id: string, data: Partial<ResearchPost>): Promise<void> => {
  const docRef = doc(db, 'research', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now()
  });
};

export const deleteResearchPost = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'research', id));
};

// Signal Post operations
export const addSignalPost = async (post: Omit<SignalPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'signals'), {
    ...post,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return docRef.id;
};

export const getSignalPosts = async (): Promise<SignalPost[]> => {
  const q = query(collection(db, 'signals'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as SignalPost));
};

export const updateSignalPost = async (id: string, data: Partial<SignalPost>): Promise<void> => {
  const docRef = doc(db, 'signals', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now()
  });
};

export const deleteSignalPost = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'signals', id));
};

// Observer Post operations
export const addObserverPost = async (post: Omit<ObserverPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'observers'), {
    ...post,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return docRef.id;
};

export const getObserverPosts = async (): Promise<ObserverPost[]> => {
  const q = query(collection(db, 'observers'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as ObserverPost));
};

export const updateObserverPost = async (id: string, data: Partial<ObserverPost>): Promise<void> => {
  const docRef = doc(db, 'observers', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now()
  });
};

export const deleteObserverPost = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'observers', id));
};
