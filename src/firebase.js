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
    apiKey: "AIzaSyDMAUllzZOl_95SqF9gw6p61axMiqOLVc4",
    authDomain: "beatbox-fed3f.firebaseapp.com",
    projectId: "beatbox-fed3f",
    storageBucket: "beatbox-fed3f.appspot.com",
    messagingSenderId: 484962252809,
    appId: "1:484962252809:web:bd3684f1d90db41200a0d8",
    databaseURL:`https://beatbox-fed3f-default-rtdb.firebaseio.com`,
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
    storage
}