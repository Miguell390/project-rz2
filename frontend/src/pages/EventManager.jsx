import React, { useState, useEffect } from 'react';
import { getEvents, createEvent, deleteEvent } from '../services/api';

function EventManager() {
  const [events, setEvents] = useState([]);
  
  // Format dates for HTML inputs
  const getLocalDatetime = (offsetMinutes = 0) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + offsetMinutes);
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({ 
    name: '', 
    criteria: [''],
    startTime: getLocalDatetime(), // Defaults to now
    endTime: getLocalDatetime(120) // Defaults to 2 hours from now
  });

  useEffect(() => { loadEvents(); },[]);

  const loadEvents = async () => {
    try {
      const res = await getEvents();
      setEvents(res.data);
    } catch (error) { console.error("Error loading events", error); }
  };

  // --- Criteria Logic ---
  const handleAddCriterion = () => setFormData({ ...formData, criteria: [...formData.criteria, ''] });
  const handleCritChange = (index, value) => {
    const newCrits = [...formData.criteria];
    newCrits[index] = value;
    setFormData({ ...formData, criteria: newCrits });
  };
  const handleRemoveCrit = (index) => setFormData({ ...formData, criteria: formData.criteria.filter((_, i) => i !== index) });

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEvent(formData);
      setFormData({ name: '', criteria: [''], startTime: getLocalDatetime(), endTime: getLocalDatetime(120) });
      loadEvents();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating event");
    }
  };

  // --- UI Helpers ---
  const getStatusColor = (status) => {
    if (status === 'Active') return '#28a745'; // Green
    if (status === 'Upcoming') return '#ffc107'; // Yellow
    return '#dc3545'; // Red (Ended)
  };

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: 'auto', fontFamily: 'Arial' }}>
      <h2>Schedule New Event</h2>
      
      <form onSubmit={handleSubmit} style={cardStyle}>
        <input type="text" placeholder="Event Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={inputStyle} required />
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Start Time</label>
            <input type="datetime-local" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} style={inputStyle} required />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>End Time</label>
            <input type="datetime-local" value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} style={inputStyle} required />
          </div>
        </div>

        <h4>Scoring Criteria</h4>
        {formData.criteria.map((crit, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input type="text" value={crit} onChange={(e) => handleCritChange(index, e.target.value)} placeholder="e.g. Presentation" style={inputStyle} required />
            <button type="button" onClick={() => handleRemoveCrit(index)} style={{color: 'red'}}>X</button>
          </div>
        ))}
        <button type="button" onClick={handleAddCriterion} style={{ marginBottom: '15px' }}>+ Add Criterion</button>
        <button type="submit" style={saveBtnStyle}>Schedule Event</button>
      </form>

      <h3>Scheduled Events</h3>
      {events.map(ev => (
        <div key={ev._id} style={{ ...cardStyle, borderLeft: `10px solid ${getStatusColor(ev.status)}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h4 style={{ margin: 0 }}>{ev.name}</h4>
            <span style={{ backgroundColor: getStatusColor(ev.status), color: 'white', padding: '5px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' }}>
              {ev.status}
            </span>
          </div>
          <p style={{ fontSize: '14px', color: '#666' }}>
            <strong>Start:</strong> {new Date(ev.startTime).toLocaleString()} <br/>
            <strong>End:</strong> {new Date(ev.endTime).toLocaleString()}
          </p>
          <p style={{ fontSize: '14px' }}><strong>Criteria:</strong> {ev.criteria.join(', ')}</p>
          <button onClick={() => { if(window.confirm('Delete?')) deleteEvent(ev._id).then(loadEvents) }} style={{color: 'red', marginTop: '10px'}}>Delete</button>
        </div>
      ))}
    </div>
  );
}

const cardStyle = { padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' };
const inputStyle = { width: '100%', padding: '10px', marginBottom: '5px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' };
const labelStyle = { fontSize: '12px', fontWeight: 'bold', color: '#555' };
const saveBtnStyle = { width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };

export default EventManager;