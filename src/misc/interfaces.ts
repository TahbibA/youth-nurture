import { User } from "firebase/auth";
import { Department, Gender, ConnectionStatus, UserType } from "./enum";
import { Timestamp } from "firebase/firestore";

// User Data Model
export interface UserData {
  uid: string;
  email: string;
  type: UserType;
  displayName: string;
  gender: Gender;
  dob: Timestamp;
  latestEducation: string;
  description: string;
  photoURL?: string;
  address?: string;
  phone?: string;
  department: Department;
  studentData?: {
    currentSchool: string;
  };
  mentorData?: {
    experience: number;
  };
}

// Connection Data Model
export interface Connection {
  uid: string;
  studentId: string;
  mentorId: string;
  status: ConnectionStatus;
}

// Chat Data Model
export interface Chat {
  uid: string;
  users: string[];
}

// Message Data Model
export interface Message {
  uid: string;
  chatId: string;
  sender: string;
  message: string;
  seen: boolean;
  time: Timestamp;
}

// Notification Data Model
export interface Notification {
  uid: string;
  userID: string;
  title: string;
  message: string;
  time: Timestamp;
  read: boolean;
}

// AuthContextType Data Model
export interface AuthContextType {
  userData: UserData | null;
  authUserData: User | null;
  loading: boolean;
  singup: (email: string, password: string) => void;
  login: (email?: string, password?: string) => void;
  logout: () => void;
}

// EventData Data Model
export interface EventData {
  uid: string;
  mentorId: string;
  title: string;
  description: string;
  date: Timestamp;
  createdAt: Timestamp;
  photoURL: string;
  link: string;
}

// Joins
// Mentors and Connection Object after Merged both data
export interface MentorConnections {
  user: UserData;
  connection: Connection;
}
