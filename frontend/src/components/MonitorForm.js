import React, { useState } from 'react';
import axios from 'axios';

const MonitorForm = () => {
  const [formData, setFormData] = useState({
    url: '',
    name: '',
    check_interval: 5,
    user_id: 1
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData); // Add this line to debug form data
    axios.post('https://localhost:3000/api/url_monitors', { url_monitor: formData }) // Ensure the URL matches your Rails server URL and uses HTTPS
      .then(response => {
        alert('Monitor added successfully!');
        window.location.href = '/';
      })
      .catch(error => {
        console.error('Error adding monitor:', error);
        alert('Failed to add monitor. Please try again.');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="URL"
        value={formData.url}
        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
      />
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
        onChange={(e) => setFormData({ ...formData, check_interval: e.target.value })}
      />
      <button type="submit">Add Monitor</button>
    </form>
  );
};

export default MonitorForm;