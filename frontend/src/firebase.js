import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBI6fhe6VZl4aBUGtRl-zltokyYLHwDHng",
  authDomain: "movie-matcher-731b0.firebaseapp.com",
  projectId: "movie-matcher-731b0",
  storageBucket: "movie-matcher-731b0.firebasestorage.app",
  messagingSenderId: "23070399015",
  appId: "1:23070399015:web:c11638aa598c97203e4c02",
  measurementId: "G-9QXQEMTTVR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;