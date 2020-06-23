import firebase from '../config/firebaseConfig';
import 'firebase/storage';

const booksDb = firebase.firestore().collection('books');
const categoriesDb = firebase.firestore().collection('categories');

export async function fetchBooks({ sorterDirection, dataIndex }) {
  try {
    let booksSnapshot
    if (sorterDirection) booksSnapshot = await booksDb.orderBy(dataIndex, sorterDirection).get();
    else booksSnapshot = await booksDb.get();
    const books = booksSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return books;
  }
  catch (err) {
    throw err;
  };
};

export async function fetchBookById(id) {
  try {
    const response = await booksDb.doc(id).get();
    const responseMapped = {
      id: response.id,
      ...response.data()
    }
    return responseMapped
  }
  catch (err) {
    throw err;
  };
};

export async function fetchCategories() {
  try {
    const categoriesSnapshot = await categoriesDb.get();
    const categories = categoriesSnapshot.docs.map(doc => {
      const categoriesMapped = doc.data();
      return categoriesMapped;
    });
    return categories[0];
  }
  catch (err) {
    throw err;
  };
};

export async function postImage(file) {
  try {
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(file.name);
    await fileRef.put(file)
    return await fileRef.getDownloadURL();
  }
  catch (err) { throw err };
};

export async function createBook(payload) {
  try {
    const response = await booksDb.add(payload);
    return response;
  }
  catch (err) {
    throw err;
  };
};