// Import the functions you need from the SDKs you need
// import { getDatabase, ref, onValue } from "../firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js'
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2gN3f9Ibrf9g9pZzaj5yo3BhcU4dNyFw",
  authDomain: "jessandmilca.firebaseapp.com",
  databaseURL: "https://jessandmilca-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "jessandmilca",
  storageBucket: "jessandmilca.appspot.com",
  messagingSenderId: "227565671742",
  appId: "1:227565671742:web:3c55018c561d8fb5fe886f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dbRef = ref(database);

async function getDbData() {
  const snapshot = await get(dbRef);
  var daArr = Object.keys(snapshot.val()).map((key) => {
    return snapshot.val()[key];
  });
  return daArr[0];
}

const form = document.getElementById('guest_form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  var da = await getDbData();

  const fname = document.getElementById('floatingInput').value;
  const lname = document.getElementById('floatingPassword').value;   

  const flatGuestsData = da.flat();

  // Compare input values with myArray
  if (flatGuestsData.includes(fname) && flatGuestsData.includes(lname)) {
    console.log("Both values found in the array");
  } else {
    console.log("One or both values not found in the array");
  }
});

