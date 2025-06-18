import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tickets: [],
  teamMembers: [
    {
      id: 1,
      name: 'John Doe',
      role: 'Senior Developer',
      color: '#2196f3',
      online: true,
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'System Administrator',
      color: '#9c27b0',
      online: true,
    },
    {
      id: 3,
      name: 'Mike Johnson',
      role: 'Network Engineer',
      color: '#4caf50',
      online: false,
    },
  ],
  loading: false,
  error: null,
  filters: {
    status: 'all',
    priority: 'all',
    search: '',
    assignedTo: 'all',
  },
};

export const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    setTickets: (state, action) => {
      state.tickets = action.payload;
    },
    addTicket: (state, action) => {
      state.tickets.unshift(action.payload);
    },
    updateTicket: (state, action) => {
      const index = state.tickets.findIndex(ticket => ticket.id === action.payload.id);
      if (index !== -1) {
        state.tickets[index] = action.payload;
      }
    },
    deleteTicket: (state, action) => {
      state.tickets = state.tickets.filter(ticket => ticket.id !== action.payload);
    },
    assignTicket: (state, action) => {
      const { ticketId, teamMember } = action.payload;
      const ticket = state.tickets.find(t => t.id === ticketId);
      if (ticket) {
        ticket.assignedTo = teamMember;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    updateTeamMemberStatus: (state, action) => {
      const { memberId, online } = action.payload;
      const member = state.teamMembers.find(m => m.id === memberId);
      if (member) {
        member.online = online;
      }
    },
  },
});

export const {
  setTickets,
  addTicket,
  updateTicket,
  deleteTicket,
  assignTicket,
  setLoading,
  setError,
  setFilters,
  updateTeamMemberStatus,
} = ticketsSlice.actions;

export default ticketsSlice.reducer; 