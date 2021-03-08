  import firebase from "firebase"

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyD59ztjw8Nsqi8yq20BXrSO3bSOQQUaq-0",
    authDomain: "ggt3-1037d.firebaseapp.com",
    databaseURL: "https://ggt3-1037d-default-rtdb.firebaseio.com",
    projectId: "ggt3-1037d",
    storageBucket: "ggt3-1037d.appspot.com",
    messagingSenderId: "400041244702",
    appId: "1:400041244702:web:a635b775df8c0813d1160f",
    measurementId: "G-V36J7CJW8M"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  const db = firebase.database();

  export {db};