import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './features/dashboardSlice';
import ticketsReducer from './features/ticketsSlice';

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    tickets: ticketsReducer,
  },
}); 