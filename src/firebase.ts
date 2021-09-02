import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBqTVb_fezf0ucNNavb5n8jwzew2cTXtho",
    authDomain: "video-calling-chat.firebaseapp.com",
    projectId: "video-calling-chat",
    storageBucket: "video-calling-chat.appspot.com",
    messagingSenderId: "735043138423",
    appId: "1:735043138423:web:453c3c94e7b9cb75136772"
}

const app = firebase.initializeApp(firebaseConfig)

export const db = app.firestore()
export const auth = app.auth()
export const storage = app.storage()
export default app