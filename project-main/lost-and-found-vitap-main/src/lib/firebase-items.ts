import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  getDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { LostFoundItem } from '../types/item';

// Collection references
const ITEMS_COLLECTION = 'items';
const USERS_COLLECTION = 'users';

// Add a new lost/found item
export const addItem = async (item: Omit<LostFoundItem, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, ITEMS_COLLECTION), {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...item };
  } catch (error) {
    console.error('Error adding item: ', error);
    throw error;
  }
};

// Update an existing item
export const updateItem = async (id: string, updates: Partial<LostFoundItem>) => {
  try {
    const itemRef = doc(db, ITEMS_COLLECTION, id);
    await updateDoc(itemRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { id, ...updates };
  } catch (error) {
    console.error('Error updating item: ', error);
    throw error;
  }
};

// Delete an item
export const deleteItem = async (id: string) => {
  try {
    const itemRef = doc(db, ITEMS_COLLECTION, id);
    await deleteDoc(itemRef);
    return id;
  } catch (error) {
    console.error('Error deleting item: ', error);
    throw error;
  }
};

// Get all items
export const getAllItems = async () => {
  try {
    const q = query(
      collection(db, ITEMS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as LostFoundItem[];
  } catch (error) {
    console.error('Error getting items: ', error);
    throw error;
  }
};

// Get items by status (lost or found)
export const getItemsByStatus = async (status: 'lost' | 'found') => {
  try {
    const q = query(
      collection(db, ITEMS_COLLECTION),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as LostFoundItem[];
  } catch (error) {
    console.error('Error getting items by status: ', error);
    throw error;
  }
};

// Get items by category
export const getItemsByCategory = async (category: string) => {
  try {
    const q = query(
      collection(db, ITEMS_COLLECTION),
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as LostFoundItem[];
  } catch (error) {
    console.error('Error getting items by category: ', error);
    throw error;
  }
};

// Get items by location
export const getItemsByLocation = async (location: string) => {
  try {
    const q = query(
      collection(db, ITEMS_COLLECTION),
      where('location', '==', location),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as LostFoundItem[];
  } catch (error) {
    console.error('Error getting items by location: ', error);
    throw error;
  }
};

// Search items by title or description
export const searchItems = async (searchTerm: string) => {
  try {
    const allItems = await getAllItems();
    const searchLower = searchTerm.toLowerCase();
    
    return allItems.filter(item => 
      item.title.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      item.category.toLowerCase().includes(searchLower) ||
      item.location.toLowerCase().includes(searchLower)
    );
  } catch (error) {
    console.error('Error searching items: ', error);
    throw error;
  }
};

// Get recent items (last 10)
export const getRecentItems = async (limitCount: number = 10) => {
  try {
    const q = query(
      collection(db, ITEMS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as LostFoundItem[];
  } catch (error) {
    console.error('Error getting recent items: ', error);
    throw error;
  }
};

// Get item by ID
export const getItemById = async (id: string) => {
  try {
    const itemRef = doc(db, ITEMS_COLLECTION, id);
    const itemSnap = await getDoc(itemRef);
    
    if (itemSnap.exists()) {
      return { id: itemSnap.id, ...itemSnap.data() } as LostFoundItem;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting item by ID: ', error);
    throw error;
  }
};
