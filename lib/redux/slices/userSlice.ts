import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface User {
  _id: string;
  name: string;
  email: string;
  username: string;
  role: string;
}

interface UserState {
  users: User[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  isLoading: false,
  error: null,
};

const getAuthHeaders = (getState: () => unknown) => {
  const state = getState() as RootState;
  return { headers: { Authorization: `Bearer ${state.auth.token}` } };
};

export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/user`,
        getAuthHeaders(getState)
      );

      return data.data.users;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload || [];
      })

      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
