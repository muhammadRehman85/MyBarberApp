import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeNp9aDoU8CDNp1apnWZvm6ZV7mKvZrbA",
  authDomain: "itsbarber-ed88d.firebaseapp.com",
  projectId: "itsbarber-ed88d",
  storageBucket: "itsbarber-ed88d.firebasestorage.app",
  messagingSenderId: "1041424753199",
  appId: "1:1041424753199:android:a2836f237e257cf9251cda"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
