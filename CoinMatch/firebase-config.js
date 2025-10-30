// ⚠️ GÜVENLİK UYARISI ⚠️
// Bu dosya hassas bilgiler içerir ve GitHub'a commit edilmemelidir!
// Production ortamında mutlaka environment variables kullanın!
// Detaylar için FIREBASE-SECURITY.md dosyasını okuyun.

// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjkBn_kyDq2TopE7QH428L9b0V-_z5mdQ",
  authDomain: "coinmatchgame.firebaseapp.com",
  databaseURL: "https://coinmatchgame-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "coinmatchgame",
  storageBucket: "coinmatchgame.firebasestorage.app",
  messagingSenderId: "83776475047",
  appId: "1:83776475047:web:b98ee6b3d351fe3ff97082"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();
