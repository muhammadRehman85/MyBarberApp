import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const authService = {
  // Register new user
  async register(email, password, userData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with display name
      await updateProfile(user, {
        displayName: userData.name
      });

      // Determine which collection to save to based on role
      const collectionName = userData.role === 'barber' ? 'barbers' : 'clients';
      
      // Save user data to appropriate collection
      await setDoc(doc(db, collectionName, user.uid), {
        ...userData,
        uid: user.uid,
        createdAt: new Date(),
        email: user.email
      });

      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Login user
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      return { success: true, user, userData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Logout user
  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get current user data
  async getCurrentUser() {
    try {
      const user = auth.currentUser;
      if (!user) return { success: false, error: 'No user logged in' };

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      return { success: true, user, userData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
