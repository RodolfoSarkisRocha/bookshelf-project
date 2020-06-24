import { createSlice } from '@reduxjs/toolkit';
import { fetchBooks, fetchCategories, postImage, createBook, fetchBookById, deleteImage, putBook } from '../services/book';
import { toast } from 'react-toastify';

export const bookSlice = createSlice({
  name: 'book',
  initialState: {
    bookBody: null,
    bookList: [],
    categoriesList: [],
    createBookLoading: false,
    error: false,
    getBookLoading: false,
    updateBookLoading: false
  },
  reducers: {
    getBookByIdSuccess: (state, action) => ({ ...state, bookBody: action.payload }),
    getBookSuccess: (state, action) => ({ ...state, bookList: action.payload }),
    getCategoriesSuccess: (state, action) => ({ ...state, categoriesList: action.payload }),
    setLoading: (state, action) => ({ ...state, [action.payload.loadingTarget]: action.payload.loadingType })
  }
});

const { getBookSuccess, setLoading, getCategoriesSuccess, getBookByIdSuccess } = bookSlice.actions;

export const getBooks = payload => async dispatch => {
  dispatch(setLoading({ loadingTarget: 'getBookLoading', loadingType: true }));
  try {
    const response = await fetchBooks(payload);
    dispatch(getBookSuccess(response));
  }
  catch (err) {
    toast.error('Impossible to retrieve books, try again later');
  }
  finally {
    dispatch(setLoading({ loadingTarget: 'getBookLoading', loadingType: false }));
  }
};

export const getCategories = () => async dispatch => {
  try {
    const categories = await fetchCategories();
    dispatch(getCategoriesSuccess(categories.categoriesList));
  }
  catch (err) {
    toast.error('There was a problem retrieving your books, try again later!');
  };
};

export const postBook = (payload, bookCover, callback) => async dispatch => {
  dispatch(setLoading({ loadingTarget: 'createBookLoading', loadingType: true }));
  try {

    if (bookCover) {
      const imageDownloadUrl = await postImage(bookCover);
      payload.cover = imageDownloadUrl;
    }
    await createBook(payload);
    toast.success('Book created successfully!');
    if (callback) callback();
  }
  catch (err) {
    toast.error('There was a problem creating the book, try again later!');
  }
  finally {
    dispatch(setLoading({ loadingTarget: 'createBookLoading', loadingType: false }));
  };
};

export const getBookById = (payload, callback) => async dispatch => {
  dispatch(setLoading({ loadingTarget: 'createBookLoading', loadingType: true }));
  try {
    const response = await fetchBookById(payload);
    dispatch(getBookByIdSuccess(response));
    if (callback) callback();
  }
  catch (err) {
    toast.error('There was a problem getting the book details, try again later!');
  }
  finally {
    dispatch(setLoading({ loadingTarget: 'createBookLoading', loadingType: false }))
  };
};

export const updateBook = (payload, bookCover, imgHasChanged, imageToDelete, callback) => async dispatch => {
  dispatch(setLoading({ loadingTarget: 'updateBookLoading', loadingType: true }));  
  try {
    if (imageToDelete) {
      // Deleting previous cover from the storage if it's different
      // from the new one
      await deleteImage(imageToDelete);
    };
    // Uploading image and getting it's download link
    // to insert into payload body
    if (imgHasChanged) {
      const imageDownloadUrl = await postImage(bookCover);
      payload.cover = imageDownloadUrl;
    }

    await putBook(payload);

    toast.success('Book edited successfully!');

    if (callback) callback();
  }
  catch (err) {
    toast.error('There was a problem editing the book, try again later!');
  }
  finally {
    dispatch(setLoading({ loadingTarget: 'updateBookLoading', loadingType: false }));
  };
}

export default bookSlice.reducer;