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

function toForm3(){
  window.location.href = 'form3.html';
}

async function getDbData() {
  const snapshot = await get(dbRef);
  var daArr = Object.keys(snapshot.val()).map((key) => {
    return snapshot.val()[key];
  });
  return daArr[0];
}


function getInputs() {
  const guestArray = [];
  const guestInputFname = document.getElementById(`floatingInput`).value;
  const guestInputLname = document.getElementById(`floatingPassword`).value;
  guestArray.push(guestInputFname, guestInputLname);
  return guestArray;
}

const form = document.getElementById('guest_form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  var da = await getDbData();

  const fname = document.getElementById('floatingInput').value;
  const lname = document.getElementById('floatingPassword').value;

  var guestRecord;
  for (var i = 1; i < da.length; i++) {
    if (da[i][0] === fname && da[i][1] === lname) {
      guestRecord = da[i];
      break;
    }
  }
  if (guestRecord) {
    // proceed to the next page with the guest record
    if (guestRecord[2] == 0) {
      const guestInputs = getInputs();
      const guestFnameConf = document.getElementById('guest-fname-conf');
      const guestLnameConf = document.getElementById('guest-lname-conf');
      guestFnameConf.textContent = guestInputs[0];
      guestLnameConf.textContent = guestInputs[1];
      const modal = new bootstrap.Modal(document.getElementById('noAddGuestModal'));
      modal.show();
    }
    else {
      localStorage.setItem('guestRecord', JSON.stringify(guestRecord));
      window.location.href = 'form_2.html';
    }


  } else {
    const modal = new bootstrap.Modal(document.getElementById('noInviteModal'));
    modal.show();
  }
});

const confirmBtn = document.getElementById('confirm-btn');
confirmBtn.addEventListener('click', toForm3);



