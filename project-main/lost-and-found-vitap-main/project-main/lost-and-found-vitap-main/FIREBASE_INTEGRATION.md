# Firebase Integration Guide

This guide explains how to integrate Firebase with your existing React components in the Lost and Found application.

## Overview

The Firebase integration provides:
- **Authentication**: User sign-up, sign-in, and profile management
- **Database**: Firestore for storing lost/found items and user data
- **Storage**: Firebase Storage for image uploads
- **Real-time Updates**: Live data synchronization

## Quick Start

1. **Set up Firebase project** (see `FIREBASE_SETUP.md`)
2. **Configure environment variables**
3. **Use the `useFirebase` hook** in your components

## Using the useFirebase Hook

### Basic Usage

```tsx
import { useFirebase } from '../hooks/useFirebase';

function MyComponent() {
  const { 
    user, 
    userProfile, 
    loading, 
    items, 
    addNewItem,
    loadItems 
  } = useFirebase();

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {user ? (
        <div>Welcome, {userProfile?.displayName}!</div>
      ) : (
        <div>Please sign in</div>
      )}
      
      {items.map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
}
```

### Authentication

```tsx
import { useFirebase } from '../hooks/useFirebase';
import { signUp, signIn, signOutUser } from '../lib/firebase-auth';

function AuthComponent() {
  const { user, userProfile } = useFirebase();

  const handleSignUp = async () => {
    try {
      await signUp('user@example.com', 'password123', {
        displayName: 'John Doe',
        phone: '+1234567890',
        regNo: 'VITAP001'
      });
    } catch (error) {
      console.error('Sign up failed:', error);
    }
  };

  const handleSignIn = async () => {
    try {
      await signIn('user@example.com', 'password123');
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Signed in as: {userProfile?.displayName}</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <div>
          <button onClick={handleSignUp}>Sign Up</button>
          <button onClick={handleSignIn}>Sign In</button>
        </div>
      )}
    </div>
  );
}
```

### Managing Items

```tsx
import { useFirebase } from '../hooks/useFirebase';
import { LostFoundItem } from '../types/item';

function ItemManager() {
  const { 
    items, 
    addNewItem, 
    updateExistingItem, 
    deleteExistingItem,
    loadItemsByStatus 
  } = useFirebase();

  const handleAddItem = async (itemData: Omit<LostFoundItem, 'id' | 'createdAt'>, imageFile?: File) => {
    try {
      await addNewItem(itemData, imageFile);
      alert('Item added successfully!');
    } catch (error) {
      console.error('Failed to add item:', error);
      alert('Failed to add item');
    }
  };

  const handleUpdateItem = async (id: string, updates: Partial<LostFoundItem>, imageFile?: File) => {
    try {
      await updateExistingItem(id, updates, imageFile);
      alert('Item updated successfully!');
    } catch (error) {
      console.error('Failed to update item:', error);
      alert('Failed to update item');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteExistingItem(id);
        alert('Item deleted successfully!');
      } catch (error) {
        console.error('Failed to delete item:', error);
        alert('Failed to delete item');
      }
    }
  };

  const handleFilterByStatus = (status: 'lost' | 'found') => {
    loadItemsByStatus(status);
  };

  return (
    <div>
      <div>
        <button onClick={() => handleFilterByStatus('lost')}>Show Lost Items</button>
        <button onClick={() => handleFilterByStatus('found')}>Show Found Items</button>
      </div>
      
      {items.map(item => (
        <div key={item.id}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <p>Status: {item.status}</p>
          <button onClick={() => handleUpdateItem(item.id, { status: 'found' })}>
            Mark as Found
          </button>
          <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

### Image Handling

```tsx
import { useFirebase } from '../hooks/useFirebase';
import { isValidImageFile, isValidFileSize } from '../lib/firebase-storage';

function ImageUploader({ itemId }: { itemId: string }) {
  const { updateExistingItem } = useFirebase();
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!isValidImageFile(file)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    if (!isValidFileSize(file, 5)) {
      alert('Image file must be smaller than 5MB');
      return;
    }

    setUploading(true);
    try {
      await updateExistingItem(itemId, {}, file);
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={uploading}
      />
      {uploading && <span>Uploading...</span>}
    </div>
  );
}
```

## Updating Existing Components

### Update AddItemDialog

```tsx
// In AddItemDialog.tsx
import { useFirebase } from '../hooks/useFirebase';

export function AddItemDialog() {
  const { addNewItem, loading } = useFirebase();
  
  const handleSubmit = async (data: FormData) => {
    try {
      await addNewItem(data, selectedImage);
      onClose();
      // Form will be reset automatically
    } catch (error) {
      // Handle error
    }
  };
  
  // ... rest of component
}
```

### Update LoginDialog

```tsx
// In LoginDialog.tsx
import { useFirebase } from '../hooks/useFirebase';
import { signIn, signUp } from '../lib/firebase-auth';

export function LoginDialog() {
  const { user } = useFirebase();
  
  const handleSignIn = async (email: string, password: string) => {
    try {
      await signIn(email, password);
      onClose();
    } catch (error) {
      // Handle error
    }
  };
  
  const handleSignUp = async (email: string, password: string, userData: any) => {
    try {
      await signUp(email, password, userData);
      onClose();
    } catch (error) {
      // Handle error
    }
  };
  
  // ... rest of component
}
```

### Update LostItemsSection and FoundItemsSection

```tsx
// In LostItemsSection.tsx and FoundItemsSection.tsx
import { useFirebase } from '../hooks/useFirebase';

export function LostItemsSection() {
  const { items, loading, loadItemsByStatus } = useFirebase();
  
  useEffect(() => {
    loadItemsByStatus('lost');
  }, [loadItemsByStatus]);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {items.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
```

## Error Handling

```tsx
import { useFirebase } from '../hooks/useFirebase';

function ErrorBoundary() {
  const [error, setError] = useState<Error | null>(null);

  const handleError = (error: Error) => {
    setError(error);
    // Log to error reporting service
    console.error('Firebase error:', error);
  };

  if (error) {
    return (
      <div className="error-boundary">
        <h2>Something went wrong</h2>
        <p>{error.message}</p>
        <button onClick={() => setError(null)}>Try Again</button>
      </div>
    );
  }

  return <YourComponent onError={handleError} />;
}
```

## Performance Optimization

### Lazy Loading

```tsx
import { lazy, Suspense } from 'react';

const FirebaseComponent = lazy(() => import('./FirebaseComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FirebaseComponent />
    </Suspense>
  );
}
```

### Debounced Search

```tsx
import { useDebounce } from '../hooks/useDebounce';
import { useFirebase } from '../hooks/useFirebase';

function SearchComponent() {
  const { searchItemsByTerm } = useFirebase();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchItemsByTerm(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, searchItemsByTerm]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search items..."
    />
  );
}
```

## Testing

### Mock Firebase for Testing

```tsx
// In your test setup
import { vi } from 'vitest';

vi.mock('../hooks/useFirebase', () => ({
  useFirebase: () => ({
    user: null,
    userProfile: null,
    loading: false,
    items: [],
    addNewItem: vi.fn(),
    updateExistingItem: vi.fn(),
    deleteExistingItem: vi.fn(),
  })
}));
```

## Best Practices

1. **Always handle errors** - Wrap Firebase operations in try-catch blocks
2. **Show loading states** - Use the `loading` state from the hook
3. **Validate data** - Check data before sending to Firebase
4. **Optimize queries** - Use specific queries instead of fetching all data
5. **Handle offline state** - Consider implementing offline persistence
6. **Security** - Never expose Firebase config in client-side code
7. **Rate limiting** - Implement rate limiting for user actions

## Troubleshooting

### Common Issues

1. **Permission denied**: Check Firestore security rules
2. **Image upload fails**: Verify storage rules and file size limits
3. **Queries slow**: Check if proper indexes are created
4. **Authentication errors**: Verify auth methods are enabled

### Debug Mode

```tsx
// Enable Firebase debug mode in development
if (import.meta.env.DEV) {
  console.log('Firebase config:', firebaseConfig);
}
```

## Next Steps

1. Implement real-time listeners for live updates
2. Add offline support with Firebase offline persistence
3. Set up Firebase Analytics for user behavior tracking
4. Implement push notifications
5. Add data export functionality
6. Set up automated backups
