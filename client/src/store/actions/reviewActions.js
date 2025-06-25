import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../config/api';

// Create review thunk
export const createReview = createAsyncThunk(
  'reviews/createReview',
  async ({ productId, review }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await apiClient.post(
        `/products/${productId}/reviews`,
        review,
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete review thunk
export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async ({ productId, reviewId }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await apiClient.delete(
        `/products/${productId}/reviews/${reviewId}`,
        config
      );

      return { productId, reviewId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);