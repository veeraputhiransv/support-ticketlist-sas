import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setTickets,
  setLoading,
  setError,
  setFilters,
  deleteTicket,
  updateTicket,
  assignTicket,
} from '../../store/features/ticketsSlice';
import styled from 'styled-components';
import CreateTicketForm from './CreateTicketForm';
import TicketAssignment from './TicketAssignment';
import { websocketService } from '../../services/websocket';

const TicketsContainer = styled.div`
  padding: 1rem;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const FilterInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
  min-width: 200px;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
`;

const TicketsGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
`;

const TicketCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const TicketHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const PriorityBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  background: ${props => {
    switch (props.priority) {
      case 'high': return '#ffebee';
      case 'medium': return '#fff3e0';
      case 'low': return '#e8f5e9';
      default: return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch (props.priority) {
      case 'high': return '#c62828';
      case 'medium': return '#ef6c00';
      case 'low': return '#2e7d32';
      default: return '#757575';
    }
  }};
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  background: ${props => {
    switch (props.status) {
      case 'open': return '#e3f2fd';
      case 'in-progress': return '#fff3e0';
      case 'resolved': return '#e8f5e9';
      default: return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'open': return '#1565c0';
      case 'in-progress': return '#ef6c00';
      case 'resolved': return '#2e7d32';
      default: return '#757575';
    }
  }};
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: #2196f3;
  color: white;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #1976d2;
  }

  &.delete {
    background: #f44336;
    &:hover {
      background: #d32f2f;
    }
  }
`;

const TicketsList = () => {
  const dispatch = useDispatch();
  const { tickets, loading, error, filters, teamMembers } = useSelector((state) => state.tickets);

  // Simulated data fetch
  const fetchTickets = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      // Simulated API call
      const response = await new Promise(resolve => 
        setTimeout(() => resolve([
          {
            id: 1,
            title: 'Server Maintenance',
            description: 'Regular server maintenance required',
            priority: 'high',
            status: 'open',
            createdAt: new Date().toISOString(),
          },
          {
            id: 2,
            title: 'Software Update',
            description: 'Update required for security patches',
            priority: 'medium',
            status: 'in-progress',
            createdAt: new Date().toISOString(),
          },
          {
            id: 3,
            title: 'Network Configuration',
            description: 'Configure new network settings',
            priority: 'low',
            status: 'resolved',
            createdAt: new Date().toISOString(),
          },
        ]), 1000)
      );
      dispatch(setTickets(response));
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFilters({ [name]: value }));
  };

  const handleStatusChange = (ticketId, newStatus) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      dispatch(updateTicket({ ...ticket, status: newStatus }));
    }
  };

  const handleDelete = (ticketId) => {
    dispatch(deleteTicket(ticketId));
  };

  const handleAssign = (ticketId, teamMember) => {
    dispatch(assignTicket({ ticketId, teamMember }));
    websocketService.send({
      type: 'notification',
      notification: {
        type: 'info',
        title: 'Ticket Assigned',
        message: `Ticket assigned to ${teamMember.name}`,
      },
    });
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filters.status === 'all' || ticket.status === filters.status;
    const matchesPriority = filters.priority === 'all' || ticket.priority === filters.priority;
    const matchesAssignedTo = filters.assignedTo === 'all' || 
      (ticket.assignedTo && ticket.assignedTo.id === parseInt(filters.assignedTo));
    const matchesSearch = ticket.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(filters.search.toLowerCase());
    return matchesStatus && matchesPriority && matchesAssignedTo && matchesSearch;
  });

  if (loading) return <div>Loading tickets...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <TicketsContainer>
      <h2>IT Support Tickets</h2>
      <CreateTicketForm />
      <FiltersContainer>
        <FilterInput
          type="text"
          name="search"
          placeholder="Search tickets..."
          value={filters.search}
          onChange={handleFilterChange}
        />
        <Select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </Select>
        <Select
          name="priority"
          value={filters.priority}
          onChange={handleFilterChange}
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>
        <Select
          name="assignedTo"
          value={filters.assignedTo}
          onChange={handleFilterChange}
        >
          <option value="all">All Assignees</option>
          {teamMembers.map(member => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </Select>
      </FiltersContainer>

      <TicketsGrid>
        {filteredTickets.map(ticket => (
          <TicketCard key={ticket.id}>
            <TicketHeader>
              <h3>{ticket.title}</h3>
              <div>
                <PriorityBadge priority={ticket.priority}>
                  {ticket.priority}
                </PriorityBadge>
                <StatusBadge status={ticket.status}>
                  {ticket.status}
                </StatusBadge>
              </div>
            </TicketHeader>
            <p>{ticket.description}</p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Select
                value={ticket.status}
                onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </Select>
              <TicketAssignment
                ticket={ticket}
                onAssign={handleAssign}
                teamMembers={teamMembers}
              />
              <Button
                className="delete"
                onClick={() => handleDelete(ticket.id)}
              >
                Delete
              </Button>
            </div>
          </TicketCard>
        ))}
      </TicketsGrid>
    </TicketsContainer>
  );
};

export default TicketsList; 