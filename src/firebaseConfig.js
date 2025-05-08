import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

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

// Initialize Storage
const storage = getStorage(app);

// Function to get user statistics
export const getUserStats = async () => {
  try {
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    
    const users = usersSnapshot.docs.map(doc => doc.data());
    const stats = users.reduce(
      (acc, user) => {
        acc[user.role.toLowerCase()]++;
        acc.total++;
        return acc;
      },
      { farmers: 0, buyers: 0, experts: 0, total: 0 }
    );
    
    return stats;
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    throw error;
  }
};

export { db, auth, storage };
export default app;