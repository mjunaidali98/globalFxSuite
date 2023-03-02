import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_APP_ID,
//   measurementId: process.env.REACT_APP_MEASUREMENT_ID
// };

// const firebaseConfig = {
//   apiKey: "AIzaSyAlfBPtlY7nQmGMXzuXIO0JdPUg9FTCrTw",
//   authDomain: "houseglobal-3b11c.firebaseapp.com",
//   projectId: "houseglobal-3b11c",
//   storageBucket: "houseglobal-3b11c.appspot.com",
//   messagingSenderId: "663104369348",
//   appId: "1:663104369348:web:5b734b12e6084ab0670f91",
//   measurementId: "G-N1Y308WQWE",
// };

const firebaseConfig = {
  apiKey: "AIzaSyB9Ws7T2NqN1a-DqMXY99tTd4QGrB6-ffk",
  authDomain: "global-fx-suite.firebaseapp.com",
  projectId: "global-fx-suite",
  storageBucket: "global-fx-suite.appspot.com",
  messagingSenderId: "781219307609",
  appId: "1:781219307609:web:e672d700307006c74e5148",
  measurementId: "G-LWSK5DM69L"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { auth, db, storage };
