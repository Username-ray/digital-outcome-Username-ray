import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyCd5u6BB6jY0iUTbJV4itMlIztOR9JLKwk",
    authDomain: "expenseincomemanagingapp.firebaseapp.com",
    projectId: "expenseincomemanagingapp",
    storageBucket: "expenseincomemanagingapp.firebasestorage.app",
    messagingSenderId: "932078408638",
    appId: "1:932078408638:web:7f8c3df9c2b3c71f839fef",
    measurementId: "G-3FHFVL5EZF"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export function loginWithGoogle() {
    return signInWithPopup(auth, provider)
}

export function logout() {
    return signOut(auth)
}

export { auth }
