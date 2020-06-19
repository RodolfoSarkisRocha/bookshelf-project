import { configureStore } from "@reduxjs/toolkit";
import bookReducer from "../reducers/book";

export default configureStore({
  reducer: bookReducer
});