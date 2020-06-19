import firebase from '../config/firebaseConfig';
import 'firebase/storage';

const booksDb = firebase.firestore().collection('books');

export async function fetchBooks({ sorterDirection, dataIndex }) {
  debugger
  try {
    let booksSnapshot
    if (sorterDirection) booksSnapshot = await booksDb.orderBy(dataIndex, sorterDirection).get();
    else booksSnapshot = await booksDb.get();
    const books = booksSnapshot.docs.map(doc => {
      const book = doc.data();
      book.id = doc.id;
      return book;
    });
    return books;
  }
  catch (err) {
    throw err;
  };
};

export async function postBook({ file, body }) {
  try {
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(file.name);
    await fileRef.put(file)
    return await fileRef.getDownloadURL();
  }
  catch (err) { throw err };
};