// Import the functions you need from the SDKs you need
// import { getDatabase, ref, onValue } from "../firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js'
import { getDatabase, ref, push, set } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js'

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

const guestData = JSON.parse(localStorage.getItem("guestRecord"));
console.log(guestData);

const guestFirstName = document.getElementById("guest-fname-intro");
const guestAddSeats = document.getElementById("add-seats-intro");
guestFirstName.textContent = guestData['alias'];
guestAddSeats.textContent = guestData['addGuestNum'];

const guestFnameConf = document.getElementById('guest-fname-conf');
const guestLnameConf = document.getElementById('guest-lname-conf');
guestFnameConf.textContent = guestData['fName'];
guestLnameConf.textContent = guestData['lName'];

function toForm3() {
    window.location.href = 'form3.html';
}

function setPreGuestData() {
    if (guestData['addGuestList']) {
        for (let i = 0; i < guestData['addGuestList'].length; i++) {
            const setGuest = document.getElementById(`floatingGuest${i + 1}`);
            setGuest.value = guestData['addGuestList'][i];
        }
    }
}


function displayInputs(number) {
    // Hide all inputs
    for (let i = 1; i <= 5; i++) {
        document.getElementById('Guest' + i).style.display = 'none';
    }

    // Display the number of inputs specified by the integer
    for (let i = 1; i <= number; i++) {
        document.getElementById('Guest' + i).style.display = 'block';
    }
    var header = document.getElementById('guest-header');
    var caption = document.getElementById('guest-caption');
    if (number === 5) {
        // add a class to the form to make it smaller
        header.classList.add('guest-header-small');
        caption.classList.add('guest-caption-small');
    }
    else if (number === 4) {
        header.classList.add('guest-header-medium');
        caption.classList.add('guest-caption-medium');
    }
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

    // Loop through the form inputs and push their values to the array
    for (let i = 1; i <= 5; i++) {
        const guestInput = document.getElementById(`floatingGuest${i}`).value;
        if (guestInput) {
            guestArray.push(capitalizeEachWord(guestInput));
        }
    }
    return guestArray;
}

displayInputs(guestData['addGuestNum']);
setPreGuestData();
const modal = new bootstrap.Modal(document.getElementById('staticBackdrop'));

const form = document.getElementById('add-guest-form');
form.addEventListener('submit', function (event) {
    event.preventDefault();

    var da = getInputs();

    const ulModal = document.getElementById('additional-guests-list');
    if (da.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No additional guests added';
        ulModal.appendChild(li);
    }
    else {
        // clear the list before adding new items
        ulModal.innerHTML = '';
        da.forEach((input) => {
            const li = document.createElement('li');
            li.textContent = input;
            ulModal.appendChild(li);
        });
    }
    modal.show();
    console.log(da);

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
        'fName': guestData['fName'],
        'lName': guestData['lName'],
        'status': 'Submitted',
        'answer': 'Yes',
        'addGuestList': guestInputs
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
        'fName': guestData['fName'],
        'lName': guestData['lName'],
        'status': 'Submitted',
        'answer': 'NoButGuestsWill',
        'addGuestList': guestInputs
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