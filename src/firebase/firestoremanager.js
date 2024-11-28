// firestoreService.js
import { db } from './firebaseConfig'; // Import your initialized Firestore instance
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

/**
 * Fetch all documents from a Firestore collection
 * @param {string} collectionName - Name of the Firestore collection
 * @returns {Promise<Array>} - Array of documents
 */
export const fetchCollection = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching collection:', error);
    throw error;
  }
};

/**
 * Fetch a single document by ID from a Firestore collection
 * @param {string} collectionName - Name of the Firestore collection
 * @param {string} docId - ID of the document to fetch
 * @returns {Promise<Object>} - Document data
 */
export const fetchDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      return { id: docSnapshot.id, ...docSnapshot.data() };
    } else {
      throw new Error('Document not found');
    }
  } catch (error) {
    console.error('Error fetching document:', error);
    throw error;
  }
};

/**
 * Add a new document to a Firestore collection
 * @param {string} collectionName - Name of the Firestore collection
 * @param {Object} data - Data to add
 * @returns {Promise<string>} - ID of the added document
 */
export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (error) {
    console.error('Error adding document:', error);
    throw error;
  }
};

/**
 * Update a document in a Firestore collection
 * @param {string} collectionName - Name of the Firestore collection
 * @param {string} docId - ID of the document to update
 * @param {Object} data - Data to update
 * @returns {Promise<void>}
 */
export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

/**
 * Delete a document from a Firestore collection
 * @param {string} collectionName - Name of the Firestore collection
 * @param {string} docId - ID of the document to delete
 * @returns {Promise<void>}
 */
export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};
