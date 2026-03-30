import React, { useState, useEffect } from 'react';
import { fetchActiveEvent, submitProjectScore } from '../services/api';

const DynamicScoringForm = ({ projectId }) => {
  const [event, setEvent] = useState(null);
  const [scores, setScores] = useState({}); // Dynamic State: { "Scope": 3, "Pitch": 5 }
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadEvent = async () => {
      const activeEvent = await fetchActiveEvent();
      setEvent(activeEvent);
      
      // Initialize state for each criterion to 0 (or 3 as a default middle ground)
      const initialScores = {};
      activeEvent.criteria.forEach(crit => {
        initialScores[crit] = 0; 
      });
      setScores(initialScores);
    };
    loadEvent();
  },[]);

  const handleScoreChange = (criterion, value) => {
    setScores(prev => ({
      ...prev,
      [criterion]: Number(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitProjectScore({
        projectId: projectId,
        eventId: event._id,
        scores: scores // Sending the dynamic map payload
      });
      setMessage('Score successfully saved/updated!');
    } catch (error) {
      setMessage('Failed to save score.');
    }
  };

  if (!event) return <p>Loading criteria...</p>;

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', maxWidth: '400px' }}>
      <h3>Scoring for: {event.name}</h3>
      
      {/* Dynamically render an input for EVERY criterion in the array */}
      {event.criteria.map((criterion) => (
        <div key={criterion} style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>{criterion}</label>
          <input
            type="number"
            min="1"
            max="5"
            value={scores[criterion]}
            onChange={(e) => handleScoreChange(criterion, e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>
      ))}
      
      <button type="submit" style={{ padding: '10px 20px', background: 'blue', color: 'white' }}>
        Submit Scores
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default DynamicScoringForm;