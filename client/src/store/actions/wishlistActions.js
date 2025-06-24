import {
  ADD_TO_WISHLIST,
  REMOVE_FROM_WISHLIST,
  CLEAR_WISHLIST
} from '../constants/wishlistConstants';

// Add to wishlist
export const addToWishlist = (product) => (dispatch, getState) => {
  dispatch({
    type: ADD_TO_WISHLIST,
    payload: product
  });

  localStorage.setItem('wishlist', JSON.stringify(getState().wishlist.wishlistItems));
};

// Remove from wishlist
export const removeFromWishlist = (productId) => (dispatch, getState) => {
  dispatch({
    type: REMOVE_FROM_WISHLIST,
    payload: productId
  });

  localStorage.setItem('wishlist', JSON.stringify(getState().wishlist.wishlistItems));
};

// Clear wishlist
export const clearWishlist = () => (dispatch) => {
  dispatch({ type: CLEAR_WISHLIST });
  localStorage.removeItem('wishlist');
};