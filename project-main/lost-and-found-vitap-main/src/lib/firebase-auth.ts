import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, db } from './firebase';

// User interface
export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  phone?: string;
  regNo?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// Collection references
const USERS_COLLECTION = 'users';

// Sign up with email and password
export const signUp = async (email: string, password: string, userData: Partial<UserProfile>) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user profile in Firestore
    const userProfile: Omit<UserProfile, 'createdAt' | 'updatedAt'> = {
      uid: user.uid,
      email: user.email || email,
      displayName: userData.displayName || '',
      phone: userData.phone || '',
      regNo: userData.regNo || '',
      role: 'user'
    };

    await setDoc(doc(db, USERS_COLLECTION, user.uid), {
      ...userProfile,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Update display name in Firebase Auth
    if (userData.displayName) {
      await updateProfile(user, {
        displayName: userData.displayName
      });
    }

    return user;
  } catch (error) {
    console.error('Error signing up: ', error);
    throw error;
  }
};

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in: ', error);
    throw error;
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out: ', error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Get user profile from Firestore
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile: ', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date()
    });
    return { uid, ...updates };
  } catch (error) {
    console.error('Error updating user profile: ', error);
    throw error;
  }
};

// Get user by registration number
export const getUserByRegNo = async (regNo: string): Promise<UserProfile | null> => {
  try {
    const q = query(
      collection(db, USERS_COLLECTION),
      where('regNo', '==', regNo)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { uid: doc.id, ...doc.data() } as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user by reg number: ', error);
    throw error;
  }
};

// Send password reset email
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset email: ', error);
    throw error;
  }
};

// Check if user is admin
export const isUserAdmin = async (uid: string): Promise<boolean> => {
  try {
    const userProfile = await getUserProfile(uid);
    return userProfile?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status: ', error);
    return false;
  }
};
