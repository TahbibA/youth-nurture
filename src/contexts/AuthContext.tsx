import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType, UserData } from "../misc/interfaces";
import { auth, fireStore } from "../misc/firebase";
import {
  GoogleAuthProvider,
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getUserData } from "../utils/firebase";
import { FirebaseError } from "firebase/app";
import { useToast } from "@chakra-ui/react";
import { doc, onSnapshot } from "firebase/firestore";
import Loading from "../components/Loading";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  return useContext<AuthContextType | undefined>(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const toast = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  console.log("🚀 ~ AuthProvider ~ userData:", userData);
  const [authUserData, setauthUserData] = useState<User | null>(null);
  console.log("🚀 ~ AuthProvider ~ authUserData:", authUserData);
  const [loading, setLoading] = useState<boolean>(true);

  const singup = async (email: string, password: string) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: "Registration Successful!",
        description:
          "You're successfully register. Go ahead and setup your profile",
        status: "success",
      });
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        if (err.code === "auth/email-already-in-use")
          toast({
            title: "User already exists",
            description:
              "This email is already in use. Try using a different email.",
            status: "warning",
          });
      }
    }
    setLoading(false);
  };

  const login = async (email?: string, password?: string) => {
    setLoading(true);
    let userCredentials: UserCredential | null = null;
    try {
      if (email && password)
        userCredentials = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      else {
        await signInWithPopup(auth, new GoogleAuthProvider());
      }
      if (userCredentials && userCredentials?.user?.emailVerified)
        toast({
          title: "Login Sucessuful!",
          status: "success",
        });
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        if (err.code === "auth/invalid-credential")
          toast({
            title: "Invalid Credentials",
            description: "Either email or password is incorrect",
            status: "error",
          });
        if (err.code === "auth/too-many-requests")
          toast({
            title: "Too many requests",
            description:
              "Please wait for a few minutes before trying again otherwise your account will be blocked.",
            status: "error",
          });

        console.error(err.code, err.message);
      }
    }
  };

  // Function to handle sign-out
  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // useEffect to subscribe to authentication changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        if (!user.emailVerified) {
          logout();
          sendEmailVerification(user);
          toast({
            title: "Verify your email!",
            description: `Please verify your email by opening the latest verification link sent to ${user.email}`,
            status: "warning",
            isClosable: true,
            duration: 30000,
          });
          return;
        }
        onSnapshot(doc(fireStore, "Users", user.uid), (doc) => {
          doc.exists() && setUserData({ ...doc.data() } as UserData);
          return;
        });
        getUserData(user.uid).then((userData: UserData | null | undefined) => {
          if (userData) {
            setUserData(userData);
          }
          setauthUserData(user);
        });
      } else {
        setUserData(null);
        setauthUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    userData,
    authUserData,
    loading,
    singup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {loading && <Loading />}
    </AuthContext.Provider>
  );
};
