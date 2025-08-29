// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, deleteDoc, getDocs, updateDoc, doc } from 'firebase/firestore'
import { auth } from "./auth.js"
import { updateProfile } from "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCd5u6BB6jY0iUTbJV4itMlIztOR9JLKwk",
    authDomain: "expenseincomemanagingapp.firebaseapp.com",
    projectId: "expenseincomemanagingapp",
    storageBucket: "expenseincomemanagingapp.firebasestorage.app",
    messagingSenderId: "932078408638",
    appId: "1:932078408638:web:7f8c3df9c2b3c71f839fef",
    measurementId: "G-3FHFVL5EZF"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Cloud Firestore and get a refenrence to the service
const db = getFirestore(app)

// Saves a transaction object to the database.
export async function addExpense(expense) {
    const user = auth.currentUser
    if (!user) throw new Error("User not logged in")

    const ref = collection(db, "users", user.uid, "expenses")
    await addDoc(ref, expense)
}
export async function addIncome(income) {
    const user = auth.currentUser
    if (!user) throw new Error("User not logged in")

    const ref = collection(db, "users", user.uid, "incomes")
    await addDoc(ref, income)
}

// Gets all the transactions from the database.
export async function getExpenses() {
    const user = auth.currentUser
    if (!user) throw new Error("User not logged in")

    const ref = collection(db, "users", user.uid, "expenses")
    const snapshot = await getDocs(ref)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}
export async function getIncomes() {
    const user = auth.currentUser
    if (!user) throw new Error("User not logged in")

    const ref = collection(db, "users", user.uid, "incomes")
    const snapshot = await getDocs(ref)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

// Deletes a transaction from the database.
export async function deleteExpense(id) {
    const user = auth.currentUser
    if (!user) throw new Error("User not logged in")

    const ref = doc(db, "users", user.uid, "expenses", id)
    await deleteDoc(ref)
}
export async function deleteIncome(id) {
    const user = auth.currentUser
    if (!user) throw new Error("User not logged in")

    const ref = doc(db, "users", user.uid, "incomes", id)
    await deleteDoc(ref)
}

export async function getWeeklyTotals() {
    const user = auth.currentUser
    if (!user) throw new Error("User not logged in")

    const incomeDocs = await getDocs(collection(db, "users", user.uid, "incomes"))
    const expenseDocs = await getDocs(collection(db, "users", user.uid, "expenses"))

    const now = new Date()
    const oneWeekAgo = new Date(now)
    oneWeekAgo.setDate(now.getDate() - 6)

    function isWithinLastWeek(dateString) {
        const recordDate = new Date(dateString)
        const today = new Date()
        const lastWeek = new Date()
        lastWeek.setDate(today.getDate() - 7)

        recordDate.setHours(0, 0, 0, 0)
        today.setHours(0, 0, 0, 0)
        lastWeek.setHours(0, 0, 0, 0)

        return recordDate >= lastWeek && recordDate <= today
    }


    let incomeTotal = 0
    let expenseTotal = 0

    incomeDocs.forEach(doc => {
        const { amount, date } = doc.data()
        if (amount && date && isWithinLastWeek(date)) {
            incomeTotal += Number(amount)
        }
    })

    expenseDocs.forEach(doc => {
        const { amount, date } = doc.data()
        if (amount && date && isWithinLastWeek(date)) {
            expenseTotal += Number(amount)
        }
    })

    return { incomeTotal, expenseTotal }
}

export async function getMonthlyExpenses(year, month) {
    const user = auth.currentUser
    if (!user) throw new Error("User not logged in")

    const expenses = []
    const snapshot = await getDocs(collection(db, "users", user.uid, "expenses"))

    snapshot.forEach((doc) => {
        const data = doc.data()
        const date = new Date(data.date)

        if (
            date.getFullYear() === year &&
            date.getMonth() + 1 === month
        ) {
            expenses.push({
                date: date,
                amount: data.amount,
            })
        }
    })

    return expenses
}

export async function updateIncome(id, updatedData) {
    const incomeRef = doc(db, "users", user.uid, "incomes", id)
    await updateDoc(incomeRef, updatedData)
}

export async function updateExpense(id, updatedData) {
    const expenseRef = doc(db, "users", user.uid, "expenses", id)
    await updateDoc(expenseRef, updatedData)
}

// --- Authentication helpers ---
export async function signup(email, password) {
    return await createUserWithEmailAndPassword(auth, email, password)
}

export async function login(email, password) {
    return await signInWithEmailAndPassword(auth, email, password)
}

export async function logout() {
    return signOut(auth)
}

export async function loginWithGoogle() {
    return signInWithPopup(auth, provider)
}

export function watchAuth(callback) {
    return onAuthStateChanged(auth, callback)
}

export async function changeEmail(newEmail) {
    if (auth.currentUser) {
        await updateEmail(auth.currentUser, newEmail)
    }
}

export async function changePassword(newPassword) {
    if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword)
    }
}

export { auth }

export async function updateDisplayName(name) {
    if (!auth.currentUser) throw new Error("No user logged in")
    await updateProfile(auth.currentUser, { displayName: name })
}