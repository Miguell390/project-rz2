import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginCall } from '../services/api';

const Login = () => {
  const[username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginCall({ username, password });
      navigate('/'); // Redirect to dashboard on success
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '20px' }}>
      <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <h2 style={{ textAlign: 'center' }}>Project RZ2 Login</h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          style={{ padding: '15px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          style={{ padding: '15px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px' }}
        />
        <button type="submit" style={{ padding: '15px', borderRadius: '8px', backgroundColor: '#007bff', color: 'white', fontSize: '16px', border: 'none', cursor: 'pointer' }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;