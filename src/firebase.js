import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDI8WV8JQfzhOzYTSOTExa2CUCOl2fi9Ak",
    authDomain: "agross-rdv.firebaseapp.com",
    projectId: "agross-rdv",
    storageBucket: "agross-rdv.firebasestorage.app",
    messagingSenderId: "995447683692",
    appId: "1:995447683692:web:ef240f85a13600f7cff649"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };