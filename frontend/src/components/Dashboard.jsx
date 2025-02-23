import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import MonitorForm from './MonitorForm';
import './Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const Dashboard = () => {
  const [monitors, setMonitors] = useState([]);
  const [filteredMonitors, setFilteredMonitors] = useState([]);
  const [historyData, setHistoryData] = useState({});
  const [visibleCharts, setVisibleCharts] = useState({});
  const [editingMonitor, setEditingMonitor] = useState(null);
  const [addingMonitor, setAddingMonitor] = useState(false);
  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

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
        setFilteredMonitors(monitors);

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

  const handleFilterAndSort = useCallback(() => {
    let filtered = monitors.filter(monitor =>
      monitor.name.toLowerCase().includes(filter.toLowerCase()) ||
      monitor.url.toLowerCase().includes(filter.toLowerCase())
    );

    filtered.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

    setFilteredMonitors(filtered);
  }, [monitors, filter, sortOrder]);

  useEffect(() => {
    handleFilterAndSort();
  }, [filter, sortOrder, monitors, handleFilterAndSort]);

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
    const monitor = monitors.find(m => m.id === monitorId);
    setEditingMonitor(monitor);
  };

  const handleSave = (updatedMonitor) => {
    const token = localStorage.getItem('token');
    axios.put(`https://localhost:3000/api/url_monitors/${updatedMonitor.id}`, { url_monitor: updatedMonitor }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setMonitors(monitors.map(m => (m.id === updatedMonitor.id ? response.data : m)));
        setEditingMonitor(null);
      })
      .catch(error => {
        console.error('Error updating monitor:', error);
      });
  };

  const handleAdd = (newMonitor) => {
    const token = localStorage.getItem('token');
    axios.post('https://localhost:3000/api/url_monitors', { url_monitor: newMonitor }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setMonitors([...monitors, response.data]);
        setAddingMonitor(false);
      })
      .catch(error => {
        console.error('Error adding monitor:', error);
      });
  };

  const getStatusClass = (status) => {
    if (status === 'up') return 'status-pill status-up';
    if (status === 'down') return 'status-pill status-down';
    return 'status-pill status-unknown';
  };

  return (
    <div className="dashboard-container">
      <h1>Monitored URLs</h1>
      <div className="filter-sort-container">
        <input
          type="text"
          placeholder="Search by Name or URL"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="asc">Sort by Name (A-Z)</option>
          <option value="desc">Sort by Name (Z-A)</option>
        </select>
      </div>
      <button onClick={() => setAddingMonitor(true)} className="add-button">Add Monitor</button>
      {filteredMonitors.length === 0 ? (
        <div className="watermark-message">
          <p>No URLs are being monitored. Please add a monitor to get started.</p>
        </div>
      ) : (
        filteredMonitors.map(monitor => (
          <div key={monitor.id} className="monitor">
            <div className="monitor-details">
              <h2>{monitor.name}</h2>
              <p>URL: {monitor.url}</p>
              <p>Status: <span className={getStatusClass(monitor.status)}>{monitor.status || 'Unknown'}</span></p>
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
      {editingMonitor && (
        <MonitorForm
          initialData={editingMonitor}
          onSubmit={handleSave}
          onClose={() => setEditingMonitor(null)}
        />
      )}
      {addingMonitor && (
        <MonitorForm
          onSubmit={handleAdd}
          onClose={() => setAddingMonitor(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
