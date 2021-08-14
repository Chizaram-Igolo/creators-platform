import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/functions";

if (process.env.NODE_ENV !== "production") {
  import("firebase/analytics").then(() => {});
}

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

function firebaseInit() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
}

firebaseInit();

// Initialize Firebase Auth, Firestore, Storage and Functions
const auth = firebase.auth();
const projectFirestore = firebase.firestore();
projectFirestore.enablePersistence({ synchronizeTabas: true }).catch((err) => {
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

export default firebase;
export { auth, projectFirestore, projectStorage, projectFunctions, timestamp };
