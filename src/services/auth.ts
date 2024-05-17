import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    return response;
  } catch (error: any) {
    throw error
  }
};