import { createReducer } from '@reduxjs/toolkit';
import { createReview, deleteReview } from '../actions/reviewActions';

const initialState = {
  loading: false,
  error: null,
};

const reviewReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(createReview.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(createReview.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    })
    .addCase(createReview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(deleteReview.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteReview.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    })
    .addCase(deleteReview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
});

export default reviewReducer;