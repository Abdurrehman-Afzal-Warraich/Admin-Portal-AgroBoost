import { initializeApp } from 'firebase/app';

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

export default app; 