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

function capitalizeEachWord(str) {
  return str
      .split(' ')  // Split the string by spaces into an array of words
      .map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()  // Capitalize first letter and make the rest lowercase
      )
      .join(' ');  // Join the array back into a single string
}


function getInputs() {
  const guestArray = [];
  const guestInputFname = document.getElementById(`floatingInput`).value;
  const guestInputLname = document.getElementById(`floatingPassword`).value;
  guestArray.push(capitalizeEachWord(guestInputFname), capitalizeEachWord(guestInputLname));
  return guestArray;
}

const formSubmit = document.getElementById('guest_form');
formSubmit.addEventListener('submit', async function (event) {

  event.preventDefault();

  const guestInputs = getInputs();
  console.log(guestInputs);
  const dataPath = 'FinalGuests/'
  const queryRef = query(ref(database, dataPath), orderByChild('fName'), equalTo(guestInputs[0]));
  console.log(queryRef);

  const snapshot = await get(queryRef);
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

      var submitButton = document.getElementById('form-btn');
      // Destroy any existing popover to avoid duplication
      var existingPopover = bootstrap.Popover.getInstance(submitButton);
      if (existingPopover) {
        existingPopover.dispose();
      }
      var popover = new bootstrap.Popover(submitButton, {
        trigger: 'manual',
        container: 'body',
        content: 'It seems this name is already in our records. If you believe this is an error or need assistance, please contact us for further assistance.',
        title: 'Name Already Registered',
      });

      // Show the popover
      popover.show();


      // Add a one-time event listener for the next click to dismiss the popover
      document.addEventListener('click', function dismissPopover(e) {
        // Check if the click is outside the popover and the button
        if (!submitButton.contains(e.target) && !document.querySelector('.popover')?.contains(e.target)) {
          popover.hide();
          // Remove this event listener after execution
          document.removeEventListener('click', dismissPopover);
        }
      });
    }
  } else {
    var da = await getDbData();

    const fname = guestInputs[0];
    const lname = guestInputs[1];

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
  }

});

const confirmBtn = document.getElementById('confirm-btn');
const confirmBtnNot = document.getElementById('confirm-btn-not');

confirmBtn.addEventListener('click', function (e) {
  confirmBtn.disabled = true;
  confirmBtnNot.disabled = true;
  const guestInputs = getInputs();
  const dataPath = 'FinalGuests/'

  // Add the new guest to the database
  const newGuestRef = push(ref(database, dataPath));

  set(newGuestRef, {
    'fName': guestInputs[0],
    'lName': guestInputs[1],
    'status': 'Submitted',
    'answer': 'Yes'
  })
  .then(() => {
      console.log('Data saved successfully.');
      toForm3();
  })
  .catch((error) => {
      console.error('Data could not be saved:', error);
      alert('Error querying data: Try refreshing your browser', error);
      raise('Error querying data:', error);
  });

});

confirmBtnNot.addEventListener('click', function (e) {
  confirmBtn.disabled = true;
  confirmBtnNot.disabled = true;
  const guestInputs = getInputs();
  const dataPath = 'FinalGuests/'

  // Add the new guest to the database
  const newGuestRef = push(ref(database, dataPath));

  set(newGuestRef, {
    'fName': guestInputs[0],
    'lName': guestInputs[1],
    'status': 'Submitted',
    'answer': 'No'
  })
  .then(() => {
      console.log('Data saved successfully.');
      toForm3();
  })
  .catch((error) => {
      console.error('Data could not be saved:', error);
      alert('Error querying data: Try refreshing your browser', error);
      raise('Error querying data:', error);
  });

});


