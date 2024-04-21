import React, { createContext, useContext, useEffect, useState } from "react";
import { Notification } from "../misc/interfaces";
import { useAuth } from "./AuthContext";
import {
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
} from "firebase/firestore"; // Import your Firebase config
import { fireStore } from "../misc/firebase";

interface NotificationContextType {
  notifications: Notification[];
  unread: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  return useContext<NotificationContextType | undefined>(NotificationContext);
};

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const userData = useAuth()?.userData;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (userData) {
      // Get a reference to the 'Notifications' collection and query documents where 'userID' is equal to userData.uid
      const notificationsRef = collection(fireStore, "Notifications");
      const notificationsQuery = query(
        notificationsRef,
        where("userID", "==", userData.uid),
        orderBy("time", "desc")
      );

      // Subscribe to real-time updates to the 'Notifications' collection based on the query
      const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
        const updatedNotifications: Notification[] = [];
        let unread = 0;
        snapshot.forEach((doc) => {
          if (doc.exists()) {
            const notificationData = doc.data() as Notification;
            updatedNotifications.push(notificationData);
            if (!notificationData.read) unread++;
          }
        });
        setNotifications(updatedNotifications);
        setUnread(unread);
      });

      // Clean up function to unsubscribe when component unmounts
      return () => unsubscribe();
    } else {
      setNotifications([]);
      setUnread(0);
    }
  }, [userData]);

  return (
    <NotificationContext.Provider value={{ notifications, unread }}>
      {children}
    </NotificationContext.Provider>
  );
};
