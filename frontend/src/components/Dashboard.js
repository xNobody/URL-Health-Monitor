import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [monitors, setMonitors] = useState([]);

  useEffect(() => {
    axios.get('/api/monitors')
      .then(response => setMonitors(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Monitored URLs</h1>
      {monitors.map(monitor => (
        <div key={monitor.id}>
          <h2>{monitor.name}</h2>
          <p>{monitor.url}</p>
          <p>Status: {monitor.status}</p>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;