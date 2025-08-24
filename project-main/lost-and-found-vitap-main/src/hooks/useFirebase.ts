import { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { 
  onAuthStateChange, 
  getCurrentUser, 
  getUserProfile,
  UserProfile 
} from '../lib/firebase-auth';
import { 
  getAllItems, 
  getItemsByStatus, 
  getItemsByCategory,
  getItemsByLocation,
  searchItems,
  getRecentItems,
  addItem,
  updateItem,
  deleteItem
} from '../lib/firebase-items';
import { 
  uploadItemImage, 
  deleteItemImage,
  isValidImageFile,
  isValidFileSize,
  compressImage
} from '../lib/firebase-storage';
import { LostFoundItem } from '../types/item';

export const useFirebase = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [recentItems, setRecentItems] = useState<LostFoundItem[]>([]);

  // Auth state management
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
      
      if (user) {
        loadUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load user profile
  const loadUserProfile = useCallback(async (uid: string) => {
    try {
      const profile = await getUserProfile(uid);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }, []);

  // Load all items
  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const allItems = await getAllItems();
      setItems(allItems);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load items by status
  const loadItemsByStatus = useCallback(async (status: 'lost' | 'found') => {
    try {
      setLoading(true);
      const statusItems = await getItemsByStatus(status);
      setItems(statusItems);
    } catch (error) {
      console.error('Error loading items by status:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load items by category
  const loadItemsByCategory = useCallback(async (category: string) => {
    try {
      setLoading(true);
      const categoryItems = await getItemsByCategory(category);
      setItems(categoryItems);
    } catch (error) {
      console.error('Error loading items by category:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load items by location
  const loadItemsByLocation = useCallback(async (location: string) => {
    try {
      setLoading(true);
      const locationItems = await getItemsByLocation(location);
      setItems(locationItems);
    } catch (error) {
      console.error('Error loading items by location:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search items
  const searchItemsByTerm = useCallback(async (searchTerm: string) => {
    try {
      setLoading(true);
      const searchResults = await searchItems(searchTerm);
      setItems(searchResults);
    } catch (error) {
      console.error('Error searching items:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load recent items
  const loadRecentItems = useCallback(async (limit: number = 10) => {
    try {
      const recent = await getRecentItems(limit);
      setRecentItems(recent);
    } catch (error) {
      console.error('Error loading recent items:', error);
    }
  }, []);

  // Add new item
  const addNewItem = useCallback(async (itemData: Omit<LostFoundItem, 'id' | 'createdAt'>, imageFile?: File) => {
    try {
      setLoading(true);
      
      let imageUrl: string | undefined;
      
      // Upload image if provided
      if (imageFile) {
        if (!isValidImageFile(imageFile)) {
          throw new Error('Invalid image file type');
        }
        
        if (!isValidFileSize(imageFile, 5)) {
          throw new Error('Image file too large (max 5MB)');
        }
        
        // Compress image before upload
        const compressedImage = await compressImage(imageFile);
        
        // Create a temporary ID for the image upload
        const tempId = `temp_${Date.now()}`;
        imageUrl = await uploadItemImage(compressedImage, tempId);
      }
      
      // Add item to Firestore
      const newItem = await addItem({
        ...itemData,
        image: imageUrl,
        userId: user?.uid || ''
      });
      
      // Reload items
      await loadItems();
      
      return newItem;
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, loadItems]);

  // Update item
  const updateExistingItem = useCallback(async (id: string, updates: Partial<LostFoundItem>, imageFile?: File) => {
    try {
      setLoading(true);
      
      let imageUrl: string | undefined;
      
      // Handle image update
      if (imageFile) {
        if (!isValidImageFile(imageFile)) {
          throw new Error('Invalid image file type');
        }
        
        if (!isValidFileSize(imageFile, 5)) {
          throw new Error('Image file too large (max 5MB)');
        }
        
        // Compress image before upload
        const compressedImage = await compressImage(imageFile);
        imageUrl = await uploadItemImage(compressedImage, id);
        
        // Delete old image if it exists
        const currentItem = items.find(item => item.id === id);
        if (currentItem?.image) {
          try {
            await deleteItemImage(currentItem.image);
          } catch (error) {
            console.warn('Could not delete old image:', error);
          }
        }
      }
      
      // Update item in Firestore
      const updatedItem = await updateItem(id, {
        ...updates,
        image: imageUrl || updates.image
      });
      
      // Reload items
      await loadItems();
      
      return updatedItem;
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [items, loadItems]);

  // Delete item
  const deleteExistingItem = useCallback(async (id: string) => {
    try {
      setLoading(true);
      
      // Delete image if it exists
      const currentItem = items.find(item => item.id === id);
      if (currentItem?.image) {
        try {
          await deleteItemImage(currentItem.image);
        } catch (error) {
          console.warn('Could not delete item image:', error);
        }
      }
      
      // Delete item from Firestore
      await deleteItem(id);
      
      // Reload items
      await loadItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [items, loadItems]);

  // Refresh data
  const refreshData = useCallback(async () => {
    if (user) {
      await Promise.all([
        loadUserProfile(user.uid),
        loadItems(),
        loadRecentItems()
      ]);
    }
  }, [user, loadUserProfile, loadItems, loadRecentItems]);

  return {
    // State
    user,
    userProfile,
    loading,
    items,
    recentItems,
    
    // Auth functions
    getCurrentUser,
    loadUserProfile,
    
    // Item functions
    loadItems,
    loadItemsByStatus,
    loadItemsByCategory,
    loadItemsByLocation,
    searchItemsByTerm,
    loadRecentItems,
    addNewItem,
    updateExistingItem,
    deleteExistingItem,
    
    // Utility functions
    refreshData,
    isValidImageFile,
    isValidFileSize,
    compressImage
  };
};
