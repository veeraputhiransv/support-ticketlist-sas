import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: {
    activeTickets: 0,
    resolvedTickets: 0,
    pendingTasks: 0,
  },
  recentActivity: [],
  loading: false,
  error: null,
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setStats: (state, action) => {
      state.stats = action.payload;
    },
    addActivity: (state, action) => {
      state.recentActivity.unshift(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setStats, addActivity, setLoading, setError } = dashboardSlice.actions;
export default dashboardSlice.reducer; 