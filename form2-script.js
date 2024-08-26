

const guestData = JSON.parse(localStorage.getItem("guestRecord"));

const guestFirstName = document.getElementById("guest-fname-intro");
const guestAddSeats = document.getElementById("add-seats-intro");
guestFirstName.textContent = guestData[0];
guestAddSeats.textContent = guestData[2];

const guestFnameConf = document.getElementById('guest-fname-conf');
const guestLnameConf = document.getElementById('guest-lname-conf');
guestFnameConf.textContent = guestData[0];
guestLnameConf.textContent = guestData[1];

function toForm3(){
    window.location.href = 'form3.html';
  }

function setPreGuestData() {
    if (guestData[3]) {
        for (let i = 0; i < guestData[3].length; i++) {
            const setGuest = document.getElementById(`floatingGuest${i + 1}`);
            setGuest.value = guestData[3][i];
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
    header = document.getElementById('guest-header');
    caption = document.getElementById('guest-caption');
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

function getInputs() {
    const guestArray = [];

    // Loop through the form inputs and push their values to the array
    for (let i = 1; i <= 5; i++) {
        const guestInput = document.getElementById(`floatingGuest${i}`).value;
        if (guestInput) {
            guestArray.push(guestInput);
        }
    }
    return guestArray;
}

displayInputs(guestData[2]);
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
confirmBtn.addEventListener('click', toForm3);

const confirmBtnNot = document.getElementById('confirm-btn-not');
confirmBtnNot.addEventListener('click', toForm3);