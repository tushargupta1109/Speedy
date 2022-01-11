import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";


const firebaseConfig = {
    apiKey: "AIzaSyD5VQxTc8G7jhAK3DeGPnpEyLkWj7Xoj-E",
    authDomain: "speedy-7c3ec.firebaseapp.com",
    projectId: "speedy-7c3ec",
    storageBucket: "speedy-7c3ec.appspot.com",
    messagingSenderId: "495484158091",
    appId: "1:495484158091:web:583609962fd9aa07f0d48e",
    measurementId: "G-WR6D4RZJWB"
  };
firebase.initializeApp(firebaseConfig);
const db=firebase.firestore();
export {db};
export default firebase;
export const auth=firebase.auth();