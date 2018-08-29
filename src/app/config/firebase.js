import firebase from 'firebase';
import 'firebase/firestore';

var firebaseConfig = {
  apiKey: "AIzaSyCKqTO5FkmzlINRL-0tIjCRKy3dMbPjiUQ",
  authDomain: "revents-e0765.firebaseapp.com",
  databaseURL: "https://revents-e0765.firebaseio.com",
  projectId: "revents-e0765",
  storageBucket: "revents-e0765.appspot.com",
  messagingSenderId: "700084867376"
};

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const settings = {
  timestampsInSnapshots: true
};
firestore.settings(settings);
export default firebase;