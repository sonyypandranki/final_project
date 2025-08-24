import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll
} from 'firebase/storage';
import { storage } from './firebase';

// Storage references
const ITEMS_IMAGES_FOLDER = 'items-images';
const USER_AVATARS_FOLDER = 'user-avatars';

// Upload item image
export const uploadItemImage = async (
  file: File, 
  itemId: string
): Promise<string> => {
  try {
    // Create a unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${itemId}_${timestamp}.${fileExtension}`;
    
    // Create storage reference
    const storageRef = ref(storage, `${ITEMS_IMAGES_FOLDER}/${fileName}`);
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading item image: ', error);
    throw error;
  }
};

// Upload user avatar
export const uploadUserAvatar = async (
  file: File, 
  userId: string
): Promise<string> => {
  try {
    // Create a unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${userId}_${timestamp}.${fileExtension}`;
    
    // Create storage reference
    const storageRef = ref(storage, `${USER_AVATARS_FOLDER}/${fileName}`);
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading user avatar: ', error);
    throw error;
  }
};

// Delete item image
export const deleteItemImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract the path from the URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1].split('?')[0];
    const storageRef = ref(storage, `${ITEMS_IMAGES_FOLDER}/${fileName}`);
    
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting item image: ', error);
    throw error;
  }
};

// Delete user avatar
export const deleteUserAvatar = async (imageUrl: string): Promise<void> => {
  try {
    // Extract the path from the URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1].split('?')[0];
    const storageRef = ref(storage, `${USER_AVATARS_FOLDER}/${fileName}`);
    
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting user avatar: ', error);
    throw error;
  }
};

// Get all images for an item
export const getItemImages = async (itemId: string): Promise<string[]> => {
  try {
    const listRef = ref(storage, ITEMS_IMAGES_FOLDER);
    const result = await listAll(listRef);
    
    const imageUrls: string[] = [];
    
    for (const itemRef of result.items) {
      if (itemRef.name.startsWith(itemId)) {
        const downloadURL = await getDownloadURL(itemRef);
        imageUrls.push(downloadURL);
      }
    }
    
    return imageUrls;
  } catch (error) {
    console.error('Error getting item images: ', error);
    throw error;
  }
};

// Validate file type
export const isValidImageFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
};

// Validate file size (max 5MB)
export const isValidFileSize = (file: File, maxSizeMB: number = 5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

// Compress image before upload (basic implementation)
export const compressImage = async (
  file: File, 
  maxWidth: number = 800, 
  maxHeight: number = 800,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress image
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        file.type,
        quality
      );
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = URL.createObjectURL(file);
  });
};
