import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

var firebaseConfig = {
  apiKey: "AIzaSyBUgIsmUu9XTyDVlFJFzV3yuNwNkjQPMfc",
  authDomain: "bookshelf-project-fe049.firebaseapp.com",
  databaseURL: "https://bookshelf-project-fe049.firebaseio.com",
  projectId: "bookshelf-project-fe049",
  storageBucket: "bookshelf-project-fe049.appspot.com",
  messagingSenderId: "936245879287",
  appId: "1:936245879287:web:209e967bd05956da17cef2",
  measurementId: "G-GRDJMD96MV"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.firestore().settings({});

export default firebase;