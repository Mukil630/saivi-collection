import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyCkS2UZv48R4LV7i0zlmG-H-iU-uoXw2jY",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "saivi-s-collection.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "saivi-s-collection",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "saivi-s-collection.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "124940592505",
  appId: process.env.FIREBASE_APP_ID || "1:124940592505:web:f76aec1dcaab3466a33ba8",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-4DH708QQV5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export { db, storage };

/**
 * Uploads a binary buffer to Firebase Storage.
 * @param {string} filename - The name of the file.
 * @param {Buffer} fileBuffer - The binary content.
 * @param {string} mimeType - The content type of the file.
 * @param {string} folder - The destination folder.
 * @returns {Promise<string>} - The download URL.
 */
export async function uploadToFirebaseStorage(filename, fileBuffer, mimeType = 'image/jpeg', folder = 'products') {
  const destinationPath = `${folder}/${filename}`;
  const fileRef = ref(storage, destinationPath);
  const metadata = { contentType: mimeType };
  
  console.log(`[FIREBASE] Uploading ${filename} to ${destinationPath}...`);
  const snapshot = await uploadBytes(fileRef, fileBuffer, metadata);
  const downloadUrl = await getDownloadURL(snapshot.ref);
  console.log(`[FIREBASE] Upload successful: ${downloadUrl}`);
  return downloadUrl;
}
