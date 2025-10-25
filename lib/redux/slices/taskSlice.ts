import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "To-Do" | "In Progress" | "Done";
  priority: "low" | "medium" | "high";
  deadline: string;
  assignee: any;
  projectId: string;
}

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  isLoading: false,
  error: null,
};

const getAuthHeaders = (getState: () => unknown) => {
  const state = getState() as RootState;
  return { headers: { Authorization: `Bearer ${state.auth.token}` } };
};

export const fetchTasksByProject = createAsyncThunk(
  "tasks/fetchByProject",
  async (projectId: string, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/task/${projectId}`,
        getAuthHeaders(getState)
      );
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/create",
  async (taskData: any, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/task`,
        taskData,
        getAuthHeaders(getState)
      );
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async (
    { id, taskData }: { id: string; taskData: any },
    { getState, rejectWithValue }
  ) => {
    try {
      const { data } = await axios.patch(
        `${API_URL}/task/${id}`,
        taskData,
        getAuthHeaders(getState)
      );
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (id: string, { getState, rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/task/${id}`, getAuthHeaders(getState));
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksByProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTasksByProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasksByProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) state.tasks[index] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t._id !== action.payload);
      });
  },
});

export default taskSlice.reducer;
