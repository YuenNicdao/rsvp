// Import the functions you need from the SDKs you need
// import { getDatabase, ref, onValue } from "../firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js'
import { getDatabase, ref, get, query, orderByChild, equalTo, push, set } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js'

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

function toForm3() {
  window.location.href = 'form3.html';
}

async function getDbData() {
  const snapshot = await get(dbRef);
  var daArr = Object.keys(snapshot.val()).map((key) => {
    return snapshot.val()['Guests'];
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
    if (da[i]['fName'] === fname && da[i]['lName'] === lname) {
      guestRecord = da[i];
      break;
    }
  }
  if (guestRecord) {
    // proceed to the next page with the guest record
    if (guestRecord['addGuestNum'] <= 0) {
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
confirmBtn.addEventListener('click', function (e) {
  const guestInputs = getInputs();
  console.log(guestInputs);
  const dataPath = 'FinalGuests/'
  const queryRef = query(ref(database, dataPath), orderByChild('fName'), equalTo(guestInputs[0]));

  get(queryRef).then((snapshot) => {
    if (snapshot.exists()) {
      const filteredResults = [];
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        if (data['lName'] === guestInputs[1]) {
          filteredResults.push(data);
        }
      });

      if (filteredResults.length > 0) {
        console.log("Matching records found:", filteredResults);
        var popover = new bootstrap.Popover(e.target, {
          trigger: 'click',
          container: 'body'
        });

        // Show the popover
        popover.show();
      } else {
        console.log("No matching records found  >> fName found but not lName.");
      }
    } else {
      console.log("No records found. Adding new guest to the database.");
      // Add the new guest to the database
      const newGuestRef = push(ref(database, dataPath));
      set(newGuestRef, {
        'fName': guestInputs[0],
        'lName': guestInputs[1],
        'status': 'Submitted',
        'answer': 'Yes'
      });
    }
  }).catch((error) => {
    console.error("Error querying data:", error);
  });

});



