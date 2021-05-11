import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyCEsv7Qt90AcMpbghm8zsdP4t0YT1glPgo",
    authDomain: "instagram-clone-759f5.firebaseapp.com",
    projectId: "instagram-clone-759f5",
    storageBucket: "instagram-clone-759f5.appspot.com",
    messagingSenderId: "230113729629",
    appId: "1:230113729629:web:e7847274bf5cfa8a2f41b4"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)

const db = firebaseApp.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

export { db, auth, storage }

export default db