const firebaseConfig = {
    apiKey: "AIzaSyAwaQ7CiOWKw4NL95HaasYySP9klvni1_0",
    authDomain: "project-50b5c.firebaseapp.com",
    databaseURL: "https://project-50b5c-default-rtdb.firebaseio.com",
    projectId: "project-50b5c",
    storageBucket: "project-50b5c.appspot.com",
    messagingSenderId: "482678866962",
    appId: "1:482678866962:web:83faec39a7b2333da084cb"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);

// Buat variabel global agar bisa digunakan di register.js
const auth = firebase.auth();
const database = firebase.database();
