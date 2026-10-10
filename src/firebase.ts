import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInAnonymously, 
  updateProfile, 
  signOut, 
  onAuthStateChanged,
  type User as FirebaseUser 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// User's provided Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDiUU0Mg1QKNSmi_sPUPWofF2EIN903Y48",
  authDomain: "fixora-8de98.firebaseapp.com",
  projectId: "fixora-8de98",
  storageBucket: "fixora-8de98.firebasestorage.app",
  messagingSenderId: "1095086855154",
  appId: "1:1095086855154:web:18461e13f5e6e48878116b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  updateProfile,
  signOut,
  onAuthStateChanged,
  type FirebaseUser,
};
