import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface User {
  _id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  profileImage?: { url: string };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  isLoading: false,
  error: null,
};

export const register = createAsyncThunk(
  "auth/register",
  async (userData: FormData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/register`, userData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return {
        user: data.data,
        message: data.message,
      };
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        message: error.message || "Registration failed",
      });
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { identifier: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, credentials);
      localStorage.setItem("token", data.data.accessToken);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const { data } = await axios.get(`${API_URL}/user/current-user`, {
        headers: { Authorization: `Bearer ${state.auth.token}` },
      });
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
