import { initializeApp } from "firebase/app";
import { get, getDatabase, ref, set, update } from "firebase/database";
import { getAuth, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API,
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

export function handleTransaction(selectedGame: any, uid: any, amount: any, mode: any) {
  get(ref(db, "games/" + selectedGame + "/players/" + uid + "/balance")).then((snapshot) => {
    if (snapshot.exists()) {
      var newBal = snapshot.val()
      switch (mode) {
        case 0:
          newBal = snapshot.val() + amount
          console.log(uid + " gaining " + amount)
          break;
        case 1:
          newBal = snapshot.val() - amount
          console.log(uid + " losing " + amount)
          break;
      }
      update(ref(db, "games/" + selectedGame + "/players/" + uid), { "balance": newBal })
    }
  })
}

export function getNumProperties(selectedGame: any, uid: any) {
  var numProperties = 0;
  get(ref(db, "games/" + selectedGame + "/players/" + uid + "/properties")).then((snapshot) => {
    if (snapshot.exists()) {
      console.log(Object.keys(snapshot.val()).length)
      numProperties = Object.keys(snapshot.val()).length
    }
  })
  console.log(numProperties)
  return numProperties
}

export function upgradeProperty(selectedGame: any, property: any, upgradeStatus: any, playerBalance: any) {
  get(ref(db, "games/" + selectedGame + "/properties/" + property)).then((snapshot) => {
    const newObj = snapshot.val();
    newObj.upgradeStatus = upgradeStatus
    if (upgradeStatus === "gather") {
      newObj.rentDue = snapshot.val().layByRent
    } else {
      newObj.rentDue = snapshot.val()[upgradeStatus]
    }
    const newBal = playerBalance - snapshot.val()[upgradeStatus]
    update(ref(db, "games/" + selectedGame + "/properties/" + property), newObj)
    update(ref(db, "games/" + selectedGame + "/players/" + auth.currentUser?.uid), { didUpgrade: true })
    set(ref(db, "games/" + selectedGame + "/players/" + auth.currentUser?.uid + "/balance"), newBal)
  })
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);