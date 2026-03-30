import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (!user) return <h2>Not Authorized</h2>;

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h1>{user.role} Dashboard</h1>
      <p>Welcome back, <strong>{user.username}</strong>!</p>
      
      <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        {user.role === 'Coordinator' ? (
          <div>
            <h3>Coordinator Controls</h3>
            <button style={btnStyle}>Add New Project</button>
            <button style={btnStyle}>Manage Judges</button>
          </div>
        ) : (
          <div>
            <h3>Judge Controls</h3>
            <button style={btnStyle}>📋 View Posters to Score</button>
          </div>
        )}
      </div>

      <button onClick={handleLogout} style={{ marginTop: '30px', color: 'red', cursor: 'pointer' }}>
        Logout
      </button>
    </div>
  );
}

const btnStyle = { padding: '10px', marginRight: '10px', cursor: 'pointer' };

export default Dashboard;