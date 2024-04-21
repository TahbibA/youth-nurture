import React, { createContext, useContext, useEffect, useState } from "react";
import { Connection, MentorConnections, UserData } from "../misc/interfaces";
import { useAuth } from "./AuthContext";
import { Unsubscribe } from "firebase/auth";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { fireStore } from "../misc/firebase";
import { UserType } from "../misc/enum";

interface ConnectionsContextType {
  connections: MentorConnections[];
  loading: boolean;
}

const ConnectionsContext = createContext<ConnectionsContextType | undefined>(
  undefined
);

export const useConnections = () => {
  return useContext<ConnectionsContextType | undefined>(ConnectionsContext);
};

export const ConnectionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const userData = useAuth()?.userData;
  const [connections, setConnections] = useState<MentorConnections[]>([]);
  const [loading, setLoading] = useState(true);

  // For Connections page for Student.
  const getConnections = async (
    callback: (data: MentorConnections[]) => void
  ) => {
    try {
      const connRef = collection(fireStore, "Connections");
      const connQuery = query(
        connRef,
        where(
          userData?.type === UserType.Student ? "studentId" : "mentorId",
          "==",
          userData?.uid
        )
      );

      const unsubscribe: Unsubscribe = onSnapshot(
        connQuery,
        async (querySnapshot) => {
          const conns: Connection[] = [];
          const uids: string[] = [];
          querySnapshot.forEach((doc) => {
            if (doc.exists()) {
              const conn = doc.data() as Connection;
              conns.push(conn as Connection);
              uids.push(
                userData?.type === UserType.Student
                  ? conn.mentorId
                  : conn.studentId
              );
            }
          });
          if (conns.length === 0) {
            callback([]);
            return unsubscribe;
          }
          const usersRef = collection(fireStore, "Users");
          const userQuery = query(usersRef, where("uid", "in", uids));
          const userQuerySnapshot = await getDocs(userQuery);
          const userConnections: MentorConnections[] = [];
          const users: Record<string, UserData> = {};
          userQuerySnapshot.forEach((doc) => {
            if (doc.exists()) {
              users[doc.id] = doc.data() as UserData;
            }
          });
          conns.forEach((connection) => {
            userConnections.push({
              connection,
              user: users[
                userData?.type === UserType.Student
                  ? connection.mentorId
                  : connection.studentId
              ],
            });
          });
          callback(userConnections);
        }
      );
      return unsubscribe;
    } catch (err) {
      console.log("🚀 ~ ConnectionsProvider:", err);
    }
  };

  useEffect(() => {
    if (!userData?.uid) return;
    let unsubscribe: Unsubscribe | undefined;
    const getUnsubscribe = async () => {
      setLoading(true);
      unsubscribe = await getConnections((data: MentorConnections[]) => {
        setConnections(data);
        setLoading(false);
      });
    };
    getUnsubscribe();
    return () => unsubscribe && unsubscribe();
  }, [userData]);

  return (
    <ConnectionsContext.Provider value={{ connections, loading }}>
      {children}
    </ConnectionsContext.Provider>
  );
};
