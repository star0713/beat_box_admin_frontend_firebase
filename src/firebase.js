import { initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import {getDatabase} from "firebase/database";
import {getStorage} from "firebase/storage";

// const history = useHistory();
const firebaseConfig = {
    apiKey: "AIzaSyBWN2ZiA53yel4arCcKV_6j7Vw0T_-WVWA",
    authDomain: "beatbox-eb2b7.firebaseapp.com",
    databaseURL: "https://beatbox-eb2b7-default-rtdb.firebaseio.com",
    projectId: "beatbox-eb2b7",
    storageBucket: "beatbox-eb2b7.appspot.com",
    messagingSenderId: "821225767067",
    appId: "1:821225767067:web:a57611f14acbd7bbfac63e",
    measurementId: "G-1F0J0K8NE4"
  };
const app = initializeApp(firebaseConfig);

const auth = getAuth();

// 
const signIn = async (email, password) => {
    console.log(email, password)
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;
        console.log(auth, "auth")
        console.log(user)
        return true
    } catch (error) {
        return { error: error.message }
    }
};
const SignOut = async () => {
    try {
        await signOut(auth);
        console.log("signout2")
        return true;
    } catch (e) {
        return false;
    }
}
const db = getDatabase(app);
const StoreDB = getFirestore(app);
const storage = getStorage(app);
export default {
    signIn: signIn,
    onAuthStateChanged,
    DB: db,
    StoreDB,
    SignOut,
    auth: auth,
    storage,
    app,
}