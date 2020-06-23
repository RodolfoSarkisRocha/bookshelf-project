import { createSlice } from '@reduxjs/toolkit';
import { fetchBooks, fetchCategories, postImage, createBook, fetchBookById } from '../services/book';
import { toast } from 'react-toastify';

export const bookSlice = createSlice({
  name: 'book',
  initialState: {
    bookBody: null,
    bookList: [],
    categoriesList: [],
    createBookLoading: false,
    error: false,
    getBookLoading: false
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

export const postBook = (payload, callback) => async dispatch => {
  dispatch(setLoading({ loadingTarget: 'createBookLoading', loadingType: true }));
  try {
    const bookBody = JSON.parse(JSON.stringify(payload.bookBodyMapped));
    const bookCover = payload.bookCover;
    if (bookCover) {
      const imageDownloadUrl = await postImage(bookCover);
      bookBody.cover = imageDownloadUrl;
    }
    await createBook(bookBody);
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
    dispatch(setLoading({ loadingTarget: 'createBookLoading', loadingType: true }))
  };
};

export default bookSlice.reducer;