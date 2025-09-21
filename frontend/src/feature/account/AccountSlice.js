import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  status: "idle",
  error: null,
};

export const fetchAccount = createAsyncThunk(
  "account/fetchAccount",
  async ({ userId, isAgent, accessToken }, { rejectWithValue }) => {
    try {
      if (userId && !isAgent) {
        const accountEndpoint = `http://localhost:8000/api/account/${userId}/`;
        const res = await fetch(accountEndpoint, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          return rejectWithValue(data);
        }
        return data;
      } else if (userId && isAgent) {
        const accountEndpoint = `http://localhost:8000/api/account/agent/${userId}/`;
        const res = await fetch(accountEndpoint, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          return rejectWithValue(data);
        }
        return data;
      }
    } catch (err) {
      return rejectWithValue(err.toString());
    }
  }
);

export const updateAccount = createAsyncThunk(
  "account/updateAccount",
  async ({ updateData, userId, isAgent, accessToken }, { rejectWithValue }) => {
    try {
      const updateEndpoint = isAgent
        ? `http://localhost:8000/api/account/agent/${userId}/update/`
        : `http://localhost:8000/api/account/${userId}/update/`;
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const res = await fetch(updateEndpoint, {
        method: "PATCH",
        headers:
          updateData instanceof FormData
            ? headers
            : {
                ...headers,
                "Content-Type": "application/json",
              },
        body:
          updateData instanceof FormData
            ? updateData
            : JSON.stringify(updateData),
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

export const registerAccount = createAsyncThunk(
  "account/registerAccount",
  async ({ userData, isAgent }, { rejectWithValue }) => {
    const registerEndpoint = isAgent
      ? "http://localhost:8000/api/account/agent/register/"
      : "http://localhost:8000/api/account/register/";
    try {
      const res = await fetch(registerEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: isAgent ? userData : JSON.stringify(userData),
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

export const loginAccount = createAsyncThunk(
  "account/loginAccount",
  async ({ username, password, isAgent }, { rejectWithValue }) => {
    try {
      const loginEndpoint = "http://localhost:8000/api/token/";
      const res = await fetch(loginEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue({
          detail: data.detail,
          statusCode: res.status,
        });
      }
      if (isAgent !== data.isAgent) {
        return rejectWithValue({
          detail: "Unautherised login method.",
          statusCode: res.status,
        });
      }
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("userId", data.userid);
      localStorage.setItem("userName", data.username);
      localStorage.setItem("isAgent", data.isAgent);
      return data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const logoutAccount = createAsyncThunk(
  "account/logoutAccount",
  async ({ accessToken, refreshToken }, { rejectWithValue }) => {
    try {
      const logoutEndpoint = "http://localhost:8000/api/account/logout/";
      const res = await fetch(logoutEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      const data = await res.text();

      if (!res.ok) {
        return rejectWithValue(data);
      }
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("isAgent");
    } catch (err) {
      return rejectWithValue(err.toString());
    }
  }
);

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAccount.pending, (state, action) => {
        state.status = "idle";
        state.error = null;
      })
      .addCase(fetchAccount.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateAccount.pending, (state, action) => {
        state.status = "idle";
        state.error = null;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(registerAccount.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(registerAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(loginAccount.pending, (state, action) => {
        state.status = "idle";
        state.error = null;
      })
      .addCase(loginAccount.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(loginAccount.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload;
      })

      .addCase(logoutAccount.fulfilled, (state, action) => {
        state.user = null;
        state.status = "idle";
        state.error = null;
      })
      .addCase(logoutAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const accountStatus = (state) => state.account.status;
export const userAccount = (state) => state.account.user;
export const isAgentAccount = (state) =>
  state.account.user.user ? true : false;
export const error = (state) => state.account.error;

export const { reset } = accountSlice.actions;

export default accountSlice.reducer;
