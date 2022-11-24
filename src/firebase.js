// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAcwkVtzwbaPQFQkYP1SwxQs5v-kRDMdpA",
  authDomain: "react-firebase-chat-app-e341d.firebaseapp.com",
  projectId: "react-firebase-chat-app-e341d",
  storageBucket: "react-firebase-chat-app-e341d.appspot.com",
  messagingSenderId: "236773376867",
  appId: "1:236773376867:web:c8884bbc0d0ae72e564956",
  measurementId: "G-6616B0J2FX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
