import React, { useState } from 'react';
import styled from 'styled-components';

const AssignmentContainer = styled.div`
  position: relative;
`;

const AssignButton = styled.button`
  padding: 0.5rem 1rem;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;

  &:hover {
    background: #1976d2;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 1000;
  margin-top: 0.5rem;
`;

const TeamMember = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s;

  &:hover {
    background: #f5f5f5;
  }

  &.selected {
    background: #e3f2fd;
  }
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.color || '#2196f3'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
`;

const StatusIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.online ? '#4caf50' : '#bdbdbd'};
  margin-left: auto;
`;

const TicketAssignment = ({ ticket, onAssign, teamMembers }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(ticket.assignedTo);

  const handleAssign = (member) => {
    setSelectedMember(member);
    onAssign(ticket.id, member);
    setIsOpen(false);
  };

  return (
    <AssignmentContainer>
      <AssignButton onClick={() => setIsOpen(!isOpen)}>
        {selectedMember ? (
          <>
            <Avatar color={selectedMember.color}>
              {selectedMember.name.charAt(0)}
            </Avatar>
            {selectedMember.name}
          </>
        ) : (
          'Assign Ticket'
        )}
      </AssignButton>

      {isOpen && (
        <Dropdown>
          {teamMembers.map(member => (
            <TeamMember
              key={member.id}
              onClick={() => handleAssign(member)}
              className={selectedMember?.id === member.id ? 'selected' : ''}
            >
              <Avatar color={member.color}>
                {member.name.charAt(0)}
              </Avatar>
              <div>
                <div>{member.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>
                  {member.role}
                </div>
              </div>
              <StatusIndicator online={member.online} />
            </TeamMember>
          ))}
        </Dropdown>
      )}
    </AssignmentContainer>
  );
};

export default TicketAssignment; 