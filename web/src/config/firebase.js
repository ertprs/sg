import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/firebase-firestore';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyA9K8tGwEX-UXd8BKLc4LOYwwxb-2X-NBs",
    authDomain: "sgcobweb.firebaseapp.com",
    databaseURL: "https://sgcobweb.firebaseio.com",
    projectId: "sgcobweb",
    storageBucket: "sgcobweb.appspot.com",
    messagingSenderId: "525078190549",
    appId: "1:525078190549:web:f8c8754dbda04d3575c55c",
    measurementId: "G-VWTQ1SYTQH"
  };

firebase.initializeApp(firebaseConfig);

export const firebaseFirestore = firebase.firestore();
export const firebaseAuth = firebase.auth;
export const firebaseStorage = firebase.storage();