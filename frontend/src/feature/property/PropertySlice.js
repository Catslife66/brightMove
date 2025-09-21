import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  properties: [],
  status: "idle",
  error: null,
};

const propertyEndpoint = "http://localhost:8000/api/property";

export const fetchProperties = createAsyncThunk(
  "properties/fetchProperties",

  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${propertyEndpoint}/`);
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

export const fetchSingleProperty = createAsyncThunk(
  "properties/fetchSingleProperty",
  async (propertyId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${propertyEndpoint}/${propertyId}/`);
      if (!res.ok) {
        return rejectWithValue(res.data);
      }
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.toString());
    }
  }
);

export const addProporty = createAsyncThunk(
  "properties/addProperty",
  async ({ proprotyData, accessToken }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${propertyEndpoint}/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(proprotyData),
      });
      const property = await res.json();
      if (!res.ok) {
        return rejectWithValue(property);
      }
    } catch (err) {
      return rejectWithValue(err.toString());
    }
  }
);

export const updateProperty = createAsyncThunk(
  "properties/updateProperty",
  async ({ propertyId, updatedData, accessToken }, { rejectWithValue }) => {
    try {
      const updateEndpoint = `${propertyEndpoint}/${propertyId}/update/`;
      const res = await fetch(updateEndpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedData),
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

export const searchProperty = createAsyncThunk(
  "property/searchProperty",
  async (q, { rejectWithValue }) => {
    try {
      const searchEndpoint = `${propertyEndpoint}/search/?q=${q}`;
      const res = await fetch(searchEndpoint);
      if (!res.ok) {
        return rejectWithValue(res.data);
      }
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.toString());
    }
  }
);

const propertySlice = createSlice({
  name: "properties",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchProperties.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.properties = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchSingleProperty.fulfilled, (state, action) => {
        state.properties = [action.payload];
      })
      .addCase(fetchSingleProperty.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addProporty.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.properties.push(action.payload);
      })
      .addCase(addProporty.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(searchProperty.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(searchProperty.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.properties = action.payload;
      })
      .addCase(searchProperty.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const properties = (state) => state.properties.properties;
export const propertyStatus = (state) => state.properties.status;
export const propertyError = (state) => state.properties.error;

export default propertySlice.reducer;
