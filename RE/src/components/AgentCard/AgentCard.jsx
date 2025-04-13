import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AgentCard.css';

const AgentCard = ({ agent }) => {
  const navigate = useNavigate();

  return (
    <div className="agent-card" onClick={() => navigate(`/agents/${agent.id}`)}>
      <img src={agent.profilePicture} alt={agent.name} className="agent-photo" />
      <h3>{agent.name}</h3>
      <p>{agent.experience} years of experience</p>
    </div>
  );
};

export default AgentCard;
