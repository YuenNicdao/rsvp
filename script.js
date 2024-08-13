import { database } from "firebasejs";

const dbRef = ref(database);
onValue(dbRef, (snapshot) => {
  const data = snapshot.val();
  console.log(data);
});
