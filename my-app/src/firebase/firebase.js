import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDH3MRSirLXj1-Ux8Rp3j97xlE-tmuJKyA",
  authDomain: "iot-and-app.firebaseapp.com",
  projectId: "iot-and-app",
  storageBucket: "iot-and-app.firebasestorage.app",
  messagingSenderId: "722936131366",
  appId: "1:722936131366:web:93d18380fa9186b3c95be7",
  measurementId: "G-47DE585H5X"
};

// ✅ เรียก initializeApp() เพื่อสร้าง Firebase app
const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

// Get a list of cities from your database
async function getCities(db) {
  const citiesCol = collection(db, 'cities');
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  return cityList;
}

export { auth, db };
export default app;