import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getEnvironment } from "../__test__/mocks/mockEnv";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const environment = getEnvironment();

const firebaseConfig = {
  apiKey: environment.VITE_API_KEY,
  authDomain: environment.VITE_AUTH_DOMAIN,
  projectId: environment.VITE_PROJECT_ID,
  storageBucket: environment.VITE_STORAGE_BUCKET,
  messagingSenderId: environment.VITE_MESSAGING_SENDER_ID,
  appId: environment.VITE_APP_ID,
  measurementId: environment.VITE_MEASUREMENT_ID,
  databaseURL: environment.VITE_DATABASE_URL,
};

export const app = initializeApp(firebaseConfig);
export const Auth = getAuth(app);
export const sign = signInWithEmailAndPassword;
export const database = getDatabase(app);
export const db = getFirestore(app);