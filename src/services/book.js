import firebase from '../config/firebaseConfig';
import 'firebase/storage';

const booksDb = firebase.firestore().collection('books');
const categoriesDb = firebase.firestore().collection('categories');

export async function fetchBooks(payload, filter) {    
  // Mapping different types of get from firebase to prevent
  // many 'Ifs' being created
  const storageByFilterType = new Map([
    ['orderBy', async () => await booksDb.orderBy(payload.dataIndex, payload?.sortBy).get()],
    ['filterByField', async () => await booksDb.where(`${payload.fieldName}.value`, '==', payload.value).get()],
    [null, async () => await booksDb.get()]
  ])
  try {
    const booksSnapshot = await storageByFilterType.get(filter)();
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
    const commentsResponse = await booksDb.doc(id).collection('comments').orderBy('creationDate').get();
    const commentsMapped = commentsResponse.docs.map(currentComment => ({
      ...currentComment.data(),
      id: currentComment.id
    }));
    const responseMapped = {
      id: response.id,
      ...response.data(),
      comments: commentsMapped
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

export async function deleteImage(url) {
  try {
    const fileRef = firebase.storage().refFromURL(url);
    await fileRef.delete();
  }
  catch (err) {
    throw err
  }
}

export async function createBook(payload) {
  try {
    const response = await booksDb.add(payload);
    return response;
  }
  catch (err) {
    throw err;
  };
};

export async function putBook({ id, ...payload }) {
  try {
    await booksDb.doc(id).set(payload);
  }
  catch (err) {
    throw err;
  };
};

export async function deleteBook({ id, ...payload }) {
  try {
    await booksDb.doc(id).set({
      ...payload,
      deleted: true
    });
  }
  catch (err) {
    throw err
  };
};

export async function postComment(payload) {
  try {
    await booksDb
      .doc(payload.parentId)
      .collection('comments')
      .add(payload);
  }
  catch (err) { throw err };
};

export async function putComment({ id, ...payload }) {
  try {
    await booksDb
      .doc(payload.parentId)
      .collection('comments')
      .doc(id)
      .set(payload);
  }
  catch (err) {
    throw err;
  };
};

export async function deleteComment(payload, targetId, parentId) {
  try {
    await booksDb
      .doc(parentId)
      .collection('comments')
      .doc(targetId)
      .update(payload);
  }
  catch (err) { throw err };
};