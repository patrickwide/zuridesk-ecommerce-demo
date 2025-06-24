import {
  ADD_TO_WISHLIST,
  REMOVE_FROM_WISHLIST,
  CLEAR_WISHLIST
} from '../constants/wishlistConstants';

const wishlistFromStorage = localStorage.getItem('wishlist')
  ? JSON.parse(localStorage.getItem('wishlist'))
  : [];

const initialState = {
  wishlistItems: wishlistFromStorage
};

const wishlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_WISHLIST:
      const item = action.payload;
      const existItem = state.wishlistItems.find(x => x._id === item._id);

      if (existItem) {
        return {
          ...state,
          wishlistItems: state.wishlistItems.map(x =>
            x._id === existItem._id ? item : x
          )
        };
      } else {
        return {
          ...state,
          wishlistItems: [...state.wishlistItems, item]
        };
      }

    case REMOVE_FROM_WISHLIST:
      return {
        ...state,
        wishlistItems: state.wishlistItems.filter(x => x._id !== action.payload)
      };

    case CLEAR_WISHLIST:
      return {
        ...state,
        wishlistItems: []
      };

    default:
      return state;
  }
};

export default wishlistReducer;