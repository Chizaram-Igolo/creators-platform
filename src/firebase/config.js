import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

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

// Initialize Firebase firestore and storage
const projectFirestore = firebase.firestore();
const projectStorage = firebase.storage();
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export const auth = firebase.auth();
export default firebase;
export { projectFirestore, projectStorage, timestamp };
