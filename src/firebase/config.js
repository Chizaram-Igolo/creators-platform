import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/storage";
import "firebase/functions";

if (process.env.NODE_ENV !== "production") {
  import("firebase/analytics").then(() => {});
}

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
    ? process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
    : null,
};

function firebaseInit() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
}

firebaseInit();

// Initialize Firebase Auth, Firestore, Storage and Functions
const auth = firebase.auth();
const projectDatabase = firebase.database();
const projectFirestore = firebase.firestore();
projectFirestore
  .enablePersistence({
    synchronizeTabs: true,
    experimentalForceOwningTab: false,
  })
  .catch((err) => {
    if (err.code === "failed-precondition") {
      // Multiple tabs open.
      console.log("Broooooo!");
    } else if (err.code === "unimplemented") {
      console.log("Can't do that");
    }
  });

const projectStorage = firebase.storage();
const projectFunctions = firebase.functions();
const timestamp = firebase.firestore.FieldValue.serverTimestamp;
const dbTimestamp = firebase.database.ServerValue.TIMESTAMP;

// If testing on Emulator
// eslint-disable-next-line no-restricted-globals
// if (location.hostname === "localhost") {
// alert(location.hostname);
//   auth.useEmulator("http://localhost:9099", { disableWarnings: true });
//   projectDatabase.useEmulator("localhost", 9000);
//   projectFirestore.useEmulator("localhost", 8080);
//   projectStorage.useEmulator("localhost", 9199);
//   projectFunctions.useEmulator("localhost", 5000);
// }

export default firebase;
export {
  auth,
  projectDatabase,
  projectFirestore,
  projectStorage,
  projectFunctions,
  timestamp,
  dbTimestamp,
};
