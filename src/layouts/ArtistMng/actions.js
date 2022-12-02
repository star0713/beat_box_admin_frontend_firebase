
import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";
import { getDatabase, ref as d_ref, onValue, set, push, update, child, remove } from "firebase/database";
import Firebase from "firebase";
