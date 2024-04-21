import React, { createContext, useContext, useState } from "react";
import { UserData } from "../misc/interfaces";
import { Department, Gender, UserType } from "../misc/enum";
import { useAuth } from "./AuthContext";
import { Timestamp } from "firebase/firestore";

interface SetupWizardContextType {
  data: UserData;
  setData: (data: UserData) => void;
}

const SetupWizardContext = createContext<SetupWizardContextType | undefined>(
  undefined
);

export const useSetupWizard = () => {
  return useContext<SetupWizardContextType | undefined>(SetupWizardContext);
};

export const SetupWizardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const authUserData = useAuth()?.authUserData;
  const [data, setData] = useState<UserData>({
    uid: authUserData?.uid || "",
    displayName:
      authUserData?.displayName || authUserData?.email?.split("@")[0] || "",
    description: "",
    dob: Timestamp.now(),
    gender: Gender.Other,
    email: authUserData?.email || "",
    latestEducation: "",
    type: UserType.Student,
    photoURL: authUserData?.photoURL || "",
    department: Department.IT,
  });
  return (
    <SetupWizardContext.Provider value={{ data, setData }}>
      {children}
    </SetupWizardContext.Provider>
  );
};
