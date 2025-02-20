import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import './Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const Dashboard = () => {
  const [monitors, setMonitors] = useState([]);
  const [historyData, setHistoryData] = useState({});
  const [visibleCharts, setVisibleCharts] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    console.log('Token:', token); // Debugging line
    axios.get('https://localhost:3000/api/url_monitors', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        console.log('Monitors response:', response.data); // Debugging line
        const monitors = response.data;
        setMonitors(monitors);

        monitors.forEach(monitor => {
          axios.get(`https://localhost:3000/api/url_monitors/${monitor.id}/history`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
            .then(historyResponse => {
              setHistoryData(prevHistoryData => ({
                ...prevHistoryData,
                [monitor.id]: historyResponse.data
              }));
            })
            .catch(error => console.error(`Error fetching history for monitor ${monitor.id}:`, error));
        });
      })
      .catch(error => console.error('Error fetching monitors:', error));
  }, []);

  const getChartData = (monitorId) => {
    const history = historyData[monitorId] || [];
    return {
      labels: history.map(entry => new Date(entry.checked_at).toLocaleString()),
      datasets: [
        {
          label: 'Response Time (ms)',
          data: history.map(entry => entry.response_time),
          fill: false,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
        },
      ],
    };
  };

  const toggleChartVisibility = (monitorId) => {
    setVisibleCharts(prevVisibleCharts => ({
      ...prevVisibleCharts,
      [monitorId]: !prevVisibleCharts[monitorId]
    }));
  };

  return (
    <div className="dashboard-container">
      <h1>Monitored URLs</h1>
      {monitors.map(monitor => (
        <div key={monitor.id} className="monitor">
          <h2>{monitor.name}</h2>
          <p>URL: {monitor.url}</p>
          <p>Status: {monitor.status || 'Unknown'}</p>
          <p>Last Checked: {monitor.last_checked_at ? new Date(monitor.last_checked_at).toLocaleString() : 'Never'}</p>
          <button onClick={() => toggleChartVisibility(monitor.id)}>
            {visibleCharts[monitor.id] ? 'Hide Chart' : 'Show Chart'}
          </button>
          {visibleCharts[monitor.id] && <Line data={getChartData(monitor.id)} />}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
