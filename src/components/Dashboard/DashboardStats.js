import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setStats, setLoading, setError } from '../../store/features/dashboardSlice';
import styled from 'styled-components';

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const DashboardStats = () => {
  const dispatch = useDispatch();
  const stats = useSelector((state) => state.dashboard.stats);
  const loading = useSelector((state) => state.dashboard.loading);
  const error = useSelector((state) => state.dashboard.error);
  
  // useRef for tracking previous stats
  const prevStatsRef = useRef(stats);
  
  // useCallback for fetching stats
  const fetchStats = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      // Simulated API call
      const response = await new Promise(resolve => 
        setTimeout(() => resolve({
          activeTickets: 15,
          resolvedTickets: 45,
          pendingTasks: 8
        }), 1000)
      );
      dispatch(setStats(response));
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // useEffect for initial data fetch and periodic updates
  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchStats]);

  // useMemo for computing derived stats
  const totalTickets = useMemo(() => 
    stats.activeTickets + stats.resolvedTickets,
    [stats.activeTickets, stats.resolvedTickets]
  );

  if (loading) return <div>Loading stats...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <StatsContainer>
      <StatCard>
        <h3>Active Tickets</h3>
        <p>{stats.activeTickets}</p>
      </StatCard>
      <StatCard>
        <h3>Resolved Tickets</h3>
        <p>{stats.resolvedTickets}</p>
      </StatCard>
      <StatCard>
        <h3>Pending Tasks</h3>
        <p>{stats.pendingTasks}</p>
      </StatCard>
      <StatCard>
        <h3>Total Tickets</h3>
        <p>{totalTickets}</p>
      </StatCard>
    </StatsContainer>
  );
};

export default DashboardStats; 