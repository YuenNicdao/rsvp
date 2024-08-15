import {ref} from 'firebase';

const dbRef = ref(database);
onValue(dbRef, (snapshot) => {
  const data = snapshot.val();
  console.log(data);
});
