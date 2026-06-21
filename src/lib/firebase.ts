import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAzGQKYBW3M2fCAwZgKE4l6YnuHseyeDC8",
  authDomain: "vednix-web.firebaseapp.com",
  projectId: "vednix-web",
  storageBucket: "vednix-web.firebasestorage.app",
  messagingSenderId: "854711974209",
  appId: "1:854711974209:web:d1edba08ec6d26f60b49c0",
  measurementId: "G-04ZJRV6YFK",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

// Initialize Analytics only in supported browsers
isSupported().then((supported) => {
  if (supported) {
    getAnalytics(app);
  }
});