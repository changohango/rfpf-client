import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB7JDF72qF3Gf3uUUPthhebY0t--8kOZKY",
    authDomain: "rfpf-server.firebaseapp.com",
    projectId: "rfpf-server",
    storageBucket: "rfpf-server.appspot.com",
    messagingSenderId: "815329521568",
    appId: "1:815329521568:web:c223e9df36115696b8bec5",
    measurementId: "G-C58Y5G9XW0"
  };

export function handleSignOut() {
  signOut(auth).then(() => {
      console.log('signed out');
  }).catch((error) => {
      console.log(error);
  })
} 

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);