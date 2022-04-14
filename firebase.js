// import firebase from 'firebase'
import firebase from 'firebase'
require('firebase/auth')
require('firebase/firestore')
// import 'firebase/firestore'
// import 'firebase/auth'


const firebaseConfig = {
  apiKey: "AIzaSyAjtg8lL8VVB_OG3Q0IbQ9687YxDPhBWiM",
  authDomain: "expense-tracker-ce41c.firebaseapp.com",
  projectId: "expense-tracker-ce41c",
  storageBucket: "expense-tracker-ce41c.appspot.com",
  messagingSenderId: "670120403667",
  appId: "1:670120403667:web:ae703da28233909d39ea26"
}

let app
// if ((firebase.apps.length === 0)) {
//   app = firebase.initializeApp(firebaseConfig)
// } else {
//   app = firebase.app()
// }
app = firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
const db = app.firestore()

export {auth, db}
