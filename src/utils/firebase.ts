import {
  Timestamp,
  Unsubscribe,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { fireStorage, fireStore } from "../misc/firebase";
import {
  Chat,
  Connection,
  MentorConnections,
  Notification,
  UserData,
} from "../misc/interfaces";
import { ConnectionStatus } from "../misc/enum";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

export const getUserData = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(fireStore, "Users", uid));
    if (userDoc && userDoc.exists()) return userDoc.data() as UserData;
    else return null;
  } catch (error) {
    console.log("🚀 ~ getUserData ~ error:", error);
    return null;
  }
};

export async function setUserData(userData: UserData): Promise<boolean> {
  try {
    const userRef = doc(fireStore, "Users", userData.uid);
    await setDoc(userRef, userData, { merge: true });
    return true;
  } catch (error) {
    console.log("🚀 ~ setUserData ~ error:", error);
    return false;
  }
}

export async function updateProfilePhoto(
  uid: string,
  image: File,
  oldURL?: string
): Promise<boolean> {
  try {
    const photoRef = ref(fireStorage, `profile_photos/${uid}`);
    await uploadBytes(photoRef, image);
    const downloadURL = await getDownloadURL(photoRef);
    const userData = {
      uid: uid,
      photoURL: downloadURL,
    };
    await setUserData(userData as UserData);

    if (oldURL && oldURL.includes("firebasestorage.googleapis.com")) {
      const previousPhotoRef = ref(fireStorage, oldURL);
      await deleteObject(previousPhotoRef);
    }

    return true;
  } catch (error) {
    console.log("🚀 ~ updateProfilePhoto ~ error:", error);
    return false;
  }
}

export async function markNotifactionAsRead(
  notificationId: string
): Promise<boolean> {
  try {
    const ref = doc(fireStore, "Notifications", notificationId);
    await updateDoc(ref, { read: true });
    return true;
  } catch (error) {
    console.log("🚀 ~ markNotifactionAsRead ~ error:", error);
    return false;
  }
}

export async function updateConnection(
  connectionId: string,
  status: ConnectionStatus,
  studentID: string,
  mentorName: string
): Promise<boolean> {
  try {
    const connectionRef = doc(fireStore, "Connections", connectionId);
    await updateDoc(connectionRef, { status });
    await createNotification({
      uid: "",
      userID: studentID,
      title: `Connection Request ${status}`,
      message: `${mentorName} has ${status} your request.`,
      time: Timestamp.now(),
      read: false,
    } as Notification);
    return true;
  } catch (error) {
    console.log("🚀 ~ setconnectionData ~ error:", error);
    return false;
  }
}

export async function createConnection(
  data: Connection,
  studentName: string
): Promise<boolean> {
  try {
    const connectionsRef = collection(fireStore, "Connections");
    const docRef = await addDoc(connectionsRef, data);
    await updateDoc(docRef, { uid: docRef.id });
    await createNotification({
      uid: "",
      userID: data.mentorId,
      title: "New Connection Request",
      message: `${studentName} has requested a connection with you.`,
      time: Timestamp.now(),
      read: false,
    } as Notification);
    return true;
  } catch (error) {
    console.error("Error creating connection:", error);
    return false;
  }
}

export async function createChat(
  user1: string,
  user2: string
): Promise<string> {
  try {
    const chatRef = collection(fireStore, "Chats");
    const docRef = await addDoc(chatRef, { uid: "", users: [user1, user2] });
    await updateDoc(docRef, { uid: docRef.id });
    return docRef.id;
  } catch (error) {
    console.error("Error creating chat:", error);
    return "";
  }
}

export const deleteChat = async (chatId: string) => {
  try {
    const chatRef = doc(fireStore, "Chats/" + chatId);
    const msgRef = collection(fireStore, "Messages/");
    const msgQuery = query(msgRef, where("chatId", "==", chatId));
    const msgSnapshot = await getDocs(msgQuery);
    msgSnapshot.forEach(async (msgDoc) => {
      await deleteDoc(msgDoc.ref);
    });
    deleteDoc(chatRef);
    return true;
  } catch (err) {
    console.log("🚀 ~ deleteChat ~ err:", err);
    return false;
  }
};

export const getChatId = async (user1: string, user2: string) => {
  try {
    if (!user1 || !user2) throw new Error("Provider Both users' IDs");
    const chatRef = collection(fireStore, "Chats");
    const chatQuery = query(
      chatRef,
      where("users", "array-contains-any", [user1, user2])
    );
    const docs = await getDocs(chatQuery);
    let chatId: string | null = null;
    docs.forEach((chatDoc) => {
      if (chatDoc.exists()) {
        const data = chatDoc.data() as Chat;
        if (data.users.includes(user1) && data.users.includes(user2)) {
          chatId = data.uid;
        }
      }
    });
    if (!chatId) {
      chatId = await createChat(user1, user2);
    }
    return chatId;
  } catch (err) {
    console.log("🚀 ~ getChatId ~ err:", err);
    return "";
  }
};

export const createNotification = async (notification: Notification) => {
  try {
    const notificationRef = collection(fireStore, "Notifications");
    const docRef = await addDoc(notificationRef, notification);
    await updateDoc(docRef, { uid: docRef.id });
    return true;
  } catch (err) {
    console.log("🚀 ~ createNotification ~ err:", err);
    return false;
  }
};

export const getMentorsBySearch = async (
  queryString: string = "",
  userType: string | null,
  department: string | null,
  studentId: string,
  onUpdate: (data: MentorConnections[]) => void
) => {
  try {
    const usersRef = collection(fireStore, "Users");

    let userQuery = query(usersRef);
    if (userType) userQuery = query(usersRef, where("type", "==", userType));
    if (department)
      userQuery = query(userQuery, where("department", "==", department));
    // if (!queryString) userQuery = query(userQuery, limit(10));
    const querySnapshot = await getDocs(userQuery);
    const mentors: UserData[] = [];
    const uids: string[] = [];
    querySnapshot.forEach((doc) => {
      if (doc.exists()) {
        const userData = doc.data() as UserData;
        if (
          !queryString ||
          userData.displayName
            .toLowerCase()
            .includes(queryString?.toLowerCase())
        ) {
          mentors.push(userData);
          uids.push(userData.uid);
        }
      }
    });

    if (mentors.length === 0) {
      onUpdate([]);
      return () => {};
    }

    const conenctionsRef = collection(fireStore, "Connections");
    const connectionsQuery = query(
      conenctionsRef,
      where("mentorId", "in", uids),
      where("studentId", "==", studentId)
    );
    const unsubscribe: Unsubscribe = onSnapshot(
      connectionsQuery,
      (snapshot) => {
        const mentorConnections: MentorConnections[] = [];
        const connections: Record<string, Connection> = {};
        snapshot.forEach((doc) => {
          if (doc.exists()) {
            const conn = doc.data() as Connection;
            connections[conn.mentorId] = conn;
          }
        });
        mentors.forEach((user) => {
          mentorConnections.push({
            user,
            connection: connections[user.uid],
          });
        });
        onUpdate(mentorConnections);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.log("🚀 ~ getMentorsBySearch:", err);
  }
};
