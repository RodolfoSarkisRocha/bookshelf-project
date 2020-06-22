import { createSlice } from '@reduxjs/toolkit';
import { fetchBooks, fetchCategories, postImage, createBook } from '../services/book';
import { toast } from 'react-toastify';

export const bookSlice = createSlice({
  name: 'book',
  initialState: {
    bookList: [],
    getBookLoading: false,
    error: false,
    categoriesList: [],
    createBookLoading: false
  },
  reducers: {
    getBookSuccess: (state, action) => ({ ...state, bookList: action.payload }),
    getCategoriesSuccess: (state, action) => ({ ...state, categoriesList: action.payload }),
    setLoading: (state, action) => ({ ...state, [action.payload.loadingTarget]: action.payload.loadingType })
  }
});

const { getBookSuccess, setLoading, getCategoriesSuccess } = bookSlice.actions;

export const getBooks = payload => dispatch => {
  dispatch(setLoading({ loadingTarget: 'getBookLoading', loadingType: true }));
  fetchBooks(payload)
    .then(response => dispatch(getBookSuccess(response)))
    .catch(error => { toast.error('Impossible to retrieve books, try again later') })
    .finally(() => dispatch(setLoading({ loadingTarget: 'getBookLoading', loadingType: false })));
};

export const getCategories = () => async dispatch => {
  try {
    const categories = await fetchCategories();
    dispatch(getCategoriesSuccess(categories.categoriesList))
  }
  catch (err) {
    toast.error('Impossible to retrieve book categories, try again later!')
  }
}

export const postBook = (payload, callback) => async dispatch => {
  dispatch(setLoading({ loadingTarget: 'createBookLoading', loadingType: true }))
  try {
    const bookBody = JSON.parse(JSON.stringify(payload.bookBodyMapped));
    const bookCover = payload.bookCover;
    if (bookCover) {
      const imageDownloadUrl = await postImage(bookCover);
      bookBody.cover = imageDownloadUrl;
    }
    await createBook(bookBody);
    toast.success('Book created successfully!');
    if (callback) callback()
  }
  catch (err) {
    toast.error('There was an error creating the book, try again later!')
  }
  finally { dispatch(setLoading({ loadingTarget: 'createBookLoading', loadingType: false })) }
}

export default bookSlice.reducer;