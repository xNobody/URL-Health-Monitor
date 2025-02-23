import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MonitorForm.css';

const MonitorForm = ({ initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    url: '',
    name: '',
    check_interval: 5,
    ...initialData
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        url: initialData.url,
        name: initialData.name,
        check_interval: initialData.check_interval,
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const request = initialData
      ? axios.put(`https://localhost:3000/api/url_monitors/${initialData.id}`, { url_monitor: formData }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      : axios.post('https://localhost:3000/api/url_monitors', { url_monitor: formData }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

    request
      .then(response => {
        alert(`Monitor ${initialData ? 'updated' : 'added'} successfully!`);
        window.location.href = '/';
      })
      .catch(error => {
        console.error(`Error ${initialData ? 'updating' : 'adding'} monitor:`, error);
        alert(`Failed to ${initialData ? 'update' : 'add'} monitor. Please try again.`);
      });
  };

  return (
    <div className="monitor-form-container">
      <h1>{initialData ? 'Edit Monitor' : 'Add Monitor'}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="URL"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          disabled={!!initialData}
        />
        {initialData && <p className="edit-mode-message">* Changing the URL will result in loss of history</p>}
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Check Interval"
          value={formData.check_interval}
          min='5'
          onChange={(e) => setFormData({ ...formData, check_interval: e.target.value })}
        />
        <div className="form-buttons">
          <button type="submit">{initialData ? 'Save Changes' : 'Add Monitor'}</button>
          {onClose && <button type="button" onClick={onClose}>Cancel</button>}
        </div>
      </form>
    </div>
  );
};

export default MonitorForm;
