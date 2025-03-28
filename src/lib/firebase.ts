import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, UserCredential, User } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, where, Timestamp, DocumentData, QuerySnapshot, doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAYCquRsb3q2ODxapDDIJNhEPYJx4h7FY",
  authDomain: "disasterapp-88040.firebaseapp.com",
  projectId: "disasterapp-88040",
  storageBucket: "disasterapp-88040.firebasestorage.app",
  messagingSenderId: "143916627259",
  appId: "1:143916627259:web:1c5f0d53c98f961200331e",
  measurementId: "G-3HPPV3SPTG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Auth functions
export const registerUser = async (email: string, password: string): Promise<UserCredential> => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const loginUser = async (email: string, password: string): Promise<UserCredential> => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// User profile interface and functions
export interface UserProfile {
  uid?: string;
  displayName?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other' | 'prefer not to say';
  email?: string;
}

export const createUserProfile = async (userId: string, profileData: UserProfile): Promise<void> => {
  const userRef = doc(db, "userProfiles", userId);
  await setDoc(userRef, {
    ...profileData,
    createdAt: Timestamp.now()
  });
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const userRef = doc(db, "userProfiles", userId);
  const docSnap = await getDoc(userRef);
  
  if (docSnap.exists()) {
    return { uid: docSnap.id, ...docSnap.data() } as UserProfile;
  } else {
    return null;
  }
};

export const updateUserProfile = async (userId: string, profileData: Partial<UserProfile>): Promise<void> => {
  const userRef = doc(db, "userProfiles", userId);
  await updateDoc(userRef, {
    ...profileData,
    updatedAt: Timestamp.now()
  });
};

// Request types
export interface Request {
  id?: string;
  userId: string;
  userEmail: string;
  description: string;
  location: string;
  phoneNumber: string;
  isUrgent: boolean;
  createdAt: Timestamp;
}

// Firestore functions
export const addRequest = async (requestData: Omit<Request, 'id' | 'createdAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, "requests"), {
    ...requestData,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

export const getAllRequests = async (): Promise<Request[]> => {
  const q = query(collection(db, "requests"), orderBy("isUrgent", "desc"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return transformQuerySnapshot(querySnapshot);
};

export const getUserRequests = async (userId: string): Promise<Request[]> => {
  const q = query(
    collection(db, "requests"), 
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  return transformQuerySnapshot(querySnapshot);
};

export const deleteRequest = async (requestId: string): Promise<void> => {
  const requestRef = doc(db, "requests", requestId);
  await deleteDoc(requestRef);
};

const transformQuerySnapshot = (querySnapshot: QuerySnapshot<DocumentData>): Request[] => {
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Request));
};

export { auth, db };
