import { configureStore } from "@reduxjs/toolkit";
import propertyReducer from "../feature/property/PropertySlice";
import accountReducer from "../feature/account/AccountSlice";
import wishlistReducer from "../feature/wishlist/WishlistSlice";

const store = configureStore({
  reducer: {
    properties: propertyReducer,
    account: accountReducer,
    wishlist: wishlistReducer,
  },
});

export default store;
