import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { AppProvider } from './context/AppContext';
import DashboardStats from './components/Dashboard/DashboardStats';
import TicketsList from './components/Tickets/TicketsList';
import NotificationSystem from './components/Notifications/NotificationSystem';
import { websocketService } from './services/websocket';
import styled from 'styled-components';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: #7f8c8d;
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const ContentSection = styled.section`
  margin-bottom: 2rem;
`;

function App() {
  useEffect(() => {
    // Initialize WebSocket connection
    websocketService.connect();

    return () => {
      websocketService.disconnect();
    };
  }, []);

  return (
    <Provider store={store}>
      <AppProvider>
        <AppContainer>
          <Header>
            <Title>SuperOps Dashboard</Title>
            <Subtitle>
              Your ultimate toolkit for optimizing workflows and boosting productivity
            </Subtitle>
          </Header>
          <ContentSection>
            <DashboardStats />
          </ContentSection>
          <ContentSection>
            <TicketsList />
          </ContentSection>
          <NotificationSystem />
        </AppContainer>
      </AppProvider>
    </Provider>
  );
}

export default App;
