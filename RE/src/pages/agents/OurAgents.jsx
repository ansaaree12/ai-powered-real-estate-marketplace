import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AgentCard from '../../components/AgentCard/AgentCard';
import './OurAgents.css';

const OurAgents = () => {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/agents')
      .then(response => setAgents(response.data))
      .catch(error => console.error('Error fetching agents:', error));
  }, []);

  return (
    <div className="our-agents-wrapper"> {/* This ensures content stays below header */}
      <div className="our-agents-container">
        <h1>Meet Our Agents</h1>
        <div className="agents-grid">
          {agents.map(agent => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurAgents;
