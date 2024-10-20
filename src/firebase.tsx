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

export function handlePropertyLandedOn(gameId: any, properties: any, uid: any, players: any, setMessage: any, match: any) {
  if (properties[match].owner !== uid && properties[match].owner !== "None") {
    if (players[properties[match].owner].isNoRentDue) {
      console.log("no rent due!")
      setMessage(players[properties[match].owner].name + " has no rent due!")
    } else {
      console.log(uid + " paying " + properties[match].owner + " " + properties[match].rentDue)
      handleTransaction(gameId, uid, properties[match].rentDue, 1)
      handleTransaction(gameId, properties[match].owner, properties[match].rentDue, 0)
      setMessage(players[uid].name + " landed on: " + properties[match].name + " - " + players[uid].name + " paying " + players[properties[match].owner].name + " $" + properties[match].rentDue)
      return (players[uid].name + " landed on: " + properties[match].name + " - " + players[uid].name + " paying " + players[properties[match].owner].name + " $" + properties[match].rentDue)
    }
  } else if (properties[match].owner === "None") {
    console.log("Property available for purchase");
    setMessage(properties[match].name + " available for purchase!")
    return (properties[match].name + " available for purchase!")
  } else if (properties[match].owner === uid) {
    setMessage(players[uid].name + " landed on: " + properties[match].name + " - own property.")
    return (players[uid].name + " landed on: " + properties[match].name + " - own property.")
  }
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

export function upgradeProperty(selectedGame: any, property: any, upgradeStatus: any, playerBalance: any, players: any, properties: any) {
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
    if (auth.currentUser) {
      const message: any = (players[auth.currentUser.uid].name + " has " + upgradeStatus + "ed " + properties[property].name + " for " + snapshot.val()[upgradeStatus])
      update(ref(db, "games/" + selectedGame + "/gameState"), { "message": message })
    }
  })
}

export function getPassGo(uid: any, gameId: any, players: any, setMessage: any) {
  if (players[uid].properties) {
    setMessage("Passing go! Recieve $50 for every farm owned (" + Object.keys(players[uid].properties).length + ")")
    console.log("Passing go! Recieve $50 for every farm owned (" + Object.keys(players[uid].properties).length + ")")
    handleTransaction(gameId, uid, Object.keys(players[uid].properties).length * 50, 0)
  } else {
    setMessage("Passing go! No properties owned.")
  }
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);