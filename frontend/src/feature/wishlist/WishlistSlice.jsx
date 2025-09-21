import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  wishlist: [],
  status: "idle",
  error: null,
};

const wishlistEndpoint = "http://localhost:8000/api/property/wishlist";

export const fetchWishList = createAsyncThunk(
  "wishlist/fetchWishList",
  async (accessToken, thunkAPI) => {
    try {
      const res = await fetch(wishlistEndpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        return thunkAPI.rejectWithValue(data);
      }
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.toString());
    }
  }
);

export const addToWishList = createAsyncThunk(
  "wishlist/addToWishList",
  async ({ propertyId, accessToken }, { rejectWithValue }) => {
    const addToEndpoint = `${wishlistEndpoint}/add/${propertyId}/`;
    try {
      const res = await fetch(addToEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        return rejectWithValue(data);
      }
      return data;
    } catch (err) {
      return rejectWithValue(err.toString());
    }
  }
);

export const deleteFromWishList = createAsyncThunk(
  "wishlist/deleteFromWishList",
  async ({ propertyId, accessToken }, { rejectWithValue }) => {
    const deleteEndpoint = `${wishlistEndpoint}/delete/${propertyId}/`;
    try {
      const res = await fetch(deleteEndpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) {
        return rejectWithValue(await res.json());
      }
      return propertyId;
    } catch (err) {
      return rejectWithValue(err.toString());
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchWishList.fulfilled, (state, action) => {
        state.wishlist = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchWishList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addToWishList.fulfilled, (state, action) => {
        state.wishlist.push(action.payload);
        state.status = "succeeded";
      })
      .addCase(addToWishList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteFromWishList.fulfilled, (state, action) => {
        state.wishlist = state.wishlist.filter(
          (item) => item.propertyId !== action.payload
        );
        state.status = "succeeded";
      })
      .addCase(deleteFromWishList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const wishlist = (state) => state.wishlist.wishlist;
export const wishlistStatus = (state) => state.wishlist.status;
export const wishlistError = (state) => state.wishlist.error;

export default wishlistSlice.reducer;
