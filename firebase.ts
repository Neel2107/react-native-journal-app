import { initializeApp } from 'firebase/app';
 
import { getFirestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyADhXSCbZLsm1rCwKzd-wIkfpZ-3gJzkf4",
    authDomain: "journal-app-a8cc5.firebaseapp.com",
    projectId: "journal-app-a8cc5",
    storageBucket: "journal-app-a8cc5.appspot.com",
    messagingSenderId: "891772533948",
    appId: "1:891772533948:web:2598785fb80ff568c4a4b9",
    measurementId: "G-E210K6SCPN"
};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
export const FIREBASE_APP = initializeApp(firebaseConfig)
export const FIREBASE_DB = getFirestore(FIREBASE_APP)
// export const FIREBASE_AUTH = getAuth(FIREBASE_APP)
