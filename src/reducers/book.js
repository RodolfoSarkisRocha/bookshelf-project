import { createSlice } from '@reduxjs/toolkit';
import { fetchBooks } from '../services/book';
import { toast } from 'react-toastify';

export const bookSlice = createSlice({
  name: 'book',
  initialState: {
    bookList: [],
    getBookLoading: false,
    error: false
  },
  reducers: {
    getBookSuccess: (state, action) => ({ ...state, bookList: action.payload }),
    setLoading: (state, action) => ({...state, [action.payload.loadingTarget]: action.payload.loadingType})
  }
});

export const { getBookSuccess, getBookFailure, setLoading } = bookSlice.actions;

export const getBooks = payload => dispatch => {
  dispatch(setLoading({ loadingTarget: 'getBookLoading', loadingType: true }));
  fetchBooks(payload)
    .then(response => dispatch(getBookSuccess(response)))
    .catch(error => {toast.error('Impossible to retrieve books, try again later')})
    .finally(() => dispatch(setLoading({ loadingTarget: 'getBookLoading', loadingType: false })));
};

export default bookSlice.reducer;