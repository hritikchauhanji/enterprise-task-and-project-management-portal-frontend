import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface Project {
  _id: string;
  name: string;
  description: string;
  deadline: string;
  members: any[];
  file?: { url: string };
  createdBy: any;
}

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
};

const getAuthHeaders = (getState: () => unknown) => {
  const state = getState() as RootState;
  return { headers: { Authorization: `Bearer ${state.auth.token}` } };
};

export const fetchProjects = createAsyncThunk(
  "projects/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const endpoint =
        state.auth.user?.role === "admin" ? "/project" : "/project/user";
      const { data } = await axios.get(
        `${API_URL}${endpoint}`,
        getAuthHeaders(getState)
      );
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/create",
  async (projectData: FormData, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/project`,
        projectData,
        getAuthHeaders(getState)
      );
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateProject = createAsyncThunk(
  "projects/update",
  async (
    { id, projectData }: { id: string; projectData: FormData },
    { getState, rejectWithValue }
  ) => {
    try {
      const { data } = await axios.patch(
        `${API_URL}/project/${id}`,
        projectData,
        getAuthHeaders(getState)
      );
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteProject = createAsyncThunk(
  "projects/delete",
  async (id: string, { getState, rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/project/${id}`, getAuthHeaders(getState));
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.unshift(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) state.projects[index] = action.payload;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((p) => p._id !== action.payload);
      });
  },
});

export const { setCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
