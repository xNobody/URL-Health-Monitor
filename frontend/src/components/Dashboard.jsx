import React, { useEffect, useState, useCallback } from 'react';
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

    // Fetch monitors
    fetch('https://localhost:3000/api/url_monitors', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch monitors');
        }
        return response.json();
      })
      .then((monitors) => {
        setMonitors(monitors);
        setFilteredMonitors(monitors);

        // Fetch history for each monitor
        monitors.forEach((monitor) => {
          fetch(`https://localhost:3000/api/url_monitors/${monitor.id}/history`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((historyResponse) => {
              if (!historyResponse.ok) {
                throw new Error(`Failed to fetch history for monitor ${monitor.id}`);
              }
              return historyResponse.json();
            })
            .then((history) => {
              setHistoryData((prevHistoryData) => ({
                ...prevHistoryData,
                [monitor.id]: history,
              }));
            })
            .catch((error) => console.error(error));
        });
      })
      .catch((error) => console.error(error));
  }, []);

  const handleFilterAndSort = useCallback(() => {
    let filtered = monitors.filter((monitor) =>
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
      labels: history.map((entry) => new Date(entry.checked_at).toLocaleString()),
      datasets: [
        {
          label: 'Response Time (ms)',
          data: history.map((entry) => entry.response_time),
          fill: false,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
        },
      ],
    };
  };

  const toggleChartVisibility = (monitorId) => {
    setVisibleCharts((prevVisibleCharts) => ({
      ...prevVisibleCharts,
      [monitorId]: !prevVisibleCharts[monitorId],
    }));
  };

  const handleDelete = (monitorId) => {
    const token = localStorage.getItem('token');
    fetch(`https://localhost:3000/api/url_monitors/${monitorId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to delete monitor ${monitorId}`);
        }
        setMonitors(monitors.filter((monitor) => monitor.id !== monitorId));
      })
      .catch((error) => console.error(error));
  };

  const handleEdit = (monitorId) => {
    const monitor = monitors.find((m) => m.id === monitorId);
    setEditingMonitor(monitor);
  };

  const handleSave = (updatedMonitor) => {
    const token = localStorage.getItem('token');
    fetch(`https://localhost:3000/api/url_monitors/${updatedMonitor.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url_monitor: updatedMonitor }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update monitor');
        }
        return response.json();
      })
      .then((updatedMonitorData) => {
        setMonitors(
          monitors.map((monitor) =>
            monitor.id === updatedMonitor.id ? updatedMonitorData : monitor
          )
        );
        setEditingMonitor(null);
      })
      .catch((error) => console.error(error));
  };

  const handleAdd = (newMonitor) => {
    const token = localStorage.getItem('token');
    fetch('https://localhost:3000/api/url_monitors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url_monitor: newMonitor }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add monitor');
        }
        return response.json();
      })
      .then((newMonitorData) => {
        setMonitors([...monitors, newMonitorData]);
        setAddingMonitor(false);
      })
      .catch((error) => console.error(error));
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
      {filteredMonitors.length === 0 ? (
        <div className="watermark-message">
          <p>No URLs are being monitored. Please add a monitor to get started.</p>
        </div>
      ) : (
        filteredMonitors.map((monitor) => (
          <div key={monitor.id} className="monitor">
            <div className="monitor-details">
              <h2>{monitor.name}</h2>
              <p>URL: {monitor.url}</p>
              <p>
                Status:{' '}
                <span className={getStatusClass(monitor.status)}>
                  {monitor.status || 'Unknown'}
                </span>
              </p>
              <p>
                Last Checked:{' '}
                {monitor.last_checked_at
                  ? new Date(monitor.last_checked_at).toLocaleString()
                  : 'Never'}
              </p>
              <button onClick={() => toggleChartVisibility(monitor.id)}>
                {visibleCharts[monitor.id] ? 'Hide Chart' : 'Show Chart'}
              </button>
              {visibleCharts[monitor.id] && <Line data={getChartData(monitor.id)} />}
            </div>
            <div className="monitor-buttons">
              <button onClick={() => handleEdit(monitor.id)} className="edit-button">
                Edit
              </button>
              <button onClick={() => handleDelete(monitor.id)} className="delete-button">
                Remove
              </button>
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
