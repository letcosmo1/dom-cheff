import { signInWithEmailAndPassword } from "firebase/auth";
import { Auth } from "./firebase";

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const response = await signInWithEmailAndPassword(Auth, email, password);
    return response;
  } catch (error: any) {
    throw error
  }
};