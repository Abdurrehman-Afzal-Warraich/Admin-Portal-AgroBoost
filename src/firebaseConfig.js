import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA3_p03SKoRhslo4O3IRNSRRVdlenOr7wE",
    authDomain: "agroboost-e1cc5.firebaseapp.com",
    projectId: "agroboost-e1cc5",
    storageBucket: "agroboost-e1cc5.appspot.com",
    messagingSenderId: "149622729159",
    appId: "1:149622729159:android:8c38b2758e03a5d59111e2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);

export { db, auth };
export default app;