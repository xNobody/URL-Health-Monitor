import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [monitors, setMonitors] = useState([]);

  useEffect(() => {
    axios.get('https://localhost:3000/api/url_monitors')
      .then(response => {
        console.log('Monitors:', response.data); // Debugging line
        setMonitors(response.data);
      })
      .catch(error => console.error('Error fetching monitors:', error));
  }, []);


  return (
    <div>
      <h1>Monitored URLs</h1>
      {monitors.map(monitor => (
        <div key={monitor.id}>
          <h2>{monitor.name}</h2>
          <p>URL: {monitor.url}</p>
          <p>Status: {monitor.status}</p>
          <p>Last Checked: {new Date(monitor.last_checked_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
