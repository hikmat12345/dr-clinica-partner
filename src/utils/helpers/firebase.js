import firebase from 'firebase/app'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyBqI6s5a19FIjnOqFjPWnIJ7f8lJhoxo78",
    authDomain: "dr-clinica.firebaseapp.com",
    projectId: "dr-clinica",
    storageBucket: "dr-clinica.appspot.com",
    messagingSenderId: "368163304803",
    appId: "1:368163304803:web:3402d7e1b977f81b9a8f56",
    measurementId: "G-2CVYN4T2JS"
  };

firebase.initializeApp(firebaseConfig);  
export default firebase