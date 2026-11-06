import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB6qFcWjLmLR-2w_IeTHVkOM48RyXHNw",
  authDomain: "hospital-pokaran.firebaseapp.com",
  projectId: "hospital-pokaran",
  storageBucket: "hospital-pokaran.firebasestorage.app",
  messagingSenderId: "315331254471",
  appId: "1:315331254471:web:3061e22fe67b60947edf"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };