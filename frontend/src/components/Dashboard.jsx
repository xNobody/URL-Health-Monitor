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
    axios.get('https://localhost:3000/api/url_monitors', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
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

  const handleDelete = (monitorId) => {
    const token = localStorage.getItem('token');
    axios.delete(`https://localhost:3000/api/url_monitors/${monitorId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(() => {
        setMonitors(monitors.filter(monitor => monitor.id !== monitorId));
      })
      .catch(error => console.error(`Error deleting monitor ${monitorId}:`, error));
  };

  const handleEdit = (monitorId) => {
    // Implement the edit functionality here
    // You can navigate to an edit page or open a modal with the monitor details
    console.log(`Edit monitor ${monitorId}`);
  };

  return (
    <div className="dashboard-container">
      <h1>Monitored URLs</h1>
      {monitors.length === 0 ? (
        <div className="watermark-message">
          <p>No URLs are being monitored. Please add a monitor to get started.</p>
        </div>
      ) : (
        monitors.map(monitor => (
          <div key={monitor.id} className="monitor">
            <div className="monitor-details">
              <h2>{monitor.name}</h2>
              <p>URL: {monitor.url}</p>
              <p>Status: {monitor.status || 'Unknown'}</p>
              <p>Last Checked: {monitor.last_checked_at ? new Date(monitor.last_checked_at).toLocaleString() : 'Never'}</p>
              <button onClick={() => toggleChartVisibility(monitor.id)}>
                {visibleCharts[monitor.id] ? 'Hide Chart' : 'Show Chart'}
              </button>
              {visibleCharts[monitor.id] && <Line data={getChartData(monitor.id)} />}
            </div>
            <div className="monitor-buttons">
              <button onClick={() => handleEdit(monitor.id)} className="edit-button">Edit</button>
              <button onClick={() => handleDelete(monitor.id)} className="delete-button">Remove</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;