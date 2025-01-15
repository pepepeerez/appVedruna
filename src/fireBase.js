// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDiyMg6dXVIwXl8ZHgHt8lNSiEspfgAGIw",
  authDomain: "appvedruna-dfa03.firebaseapp.com",
  projectId: "appvedruna-dfa03",
  storageBucket: "appvedruna-dfa03.firebasestorage.app",
  messagingSenderId: "301207904128",
  appId: "1:301207904128:web:7e1fbbe1c37159bbf86b65",
  measurementId: "G-GP8NW16KD3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);