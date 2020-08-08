import firebase from "firebase";
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAcHk4nHhJDEpJnkJjTs3wOk5KH5j9w55I",
  authDomain: "instagram-clone-8a387.firebaseapp.com",
  databaseURL: "https://instagram-clone-8a387.firebaseio.com",
  projectId: "instagram-clone-8a387",
  storageBucket: "instagram-clone-8a387.appspot.com",
  messagingSenderId: "770318945677",
  appId: "1:770318945677:web:558ef965a39b09e64081c4",
  measurementId: "G-6MGRJZ3KZV",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
