import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { websocketService } from '../../services/websocket';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const NotificationContainer = styled.div`
  position: fixed;  
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Notification = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 300px;
  max-width: 400px;
  animation: ${props => props.isExiting ? slideOut : slideIn} 0.3s ease-in-out;
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

const Icon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${props => {
    switch (props.type) {
      case 'success': return '#4caf50';
      case 'error': return '#f44336';
      case 'warning': return '#ff9800';
      default: return '#2196f3';
    }
  }};
  color: white;
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.h4`
  margin: 0 0 4px 0;
  color: #2c3e50;
`;

const Message = styled.p`
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #95a5a6;
  cursor: pointer;
  padding: 4px;
  font-size: 1.2rem;
  line-height: 1;
  &:hover {
    color: #7f8c8d;
  }
`;

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isExiting: true }
          : notification
      )
    );

    // Remove from DOM after animation
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 300);
  }, []);

  const addNotification = useCallback((notification) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { ...notification, id }]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  }, [removeNotification]);

  useEffect(() => {
    const handleNewNotification = (data) => {
      if (data.type === 'notification') {
        addNotification(data.notification);
      }
    };

    // Subscribe to WebSocket notifications
    const unsubscribe = websocketService.subscribe(handleNewNotification);

    return () => {
      unsubscribe();
    };
  }, [addNotification]);

  return (
    <NotificationContainer>
      {notifications.map(notification => (
        <Notification 
          key={notification.id}
          isExiting={notification.isExiting}
        >
          <Icon type={notification.type}>
            {notification.type === 'success' && '✓'}
            {notification.type === 'error' && '✕'}
            {notification.type === 'warning' && '!'}
            {notification.type === 'info' && 'i'}
          </Icon>
          <Content>
            <Title>{notification.title}</Title>
            <Message>{notification.message}</Message>
          </Content>
          <CloseButton onClick={() => removeNotification(notification.id)}>
            ×
          </CloseButton>
        </Notification>
      ))}
    </NotificationContainer>
  );
};

export default NotificationSystem; 