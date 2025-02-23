import React, { useState } from 'react';
import './MonitorForm.css';

const MonitorForm = ({ initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    url: '',
    name: '',
    check_interval: 5,
    ...initialData
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
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
