import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDmB73MeRNRvdietx6RJOhzsTx7fQXQW2Y",
  authDomain: "fragment-test-4cf3c.firebaseapp.com",
  projectId: "fragment-test-4cf3c",
  storageBucket: "fragment-test-4cf3c.firebasestorage.app",
  messagingSenderId: "241785405402",
  appId: "1:241785405402:web:8f72efc4b255bf1f480ae3",
  measurementId: "G-VTXZDBB8KG"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
