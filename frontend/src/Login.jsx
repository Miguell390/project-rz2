import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from './services/api'; 

function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // SECURITY CHECK: If user is already logged in, send them straight to dashboard
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      const res = await loginUser(form);
      
      // 1. Log the success to the browser console for debugging
      console.log("SERVER RESPONSE:", res.data);

      // 2. Save the token and the user info to LocalStorage
      // We save the token for API calls, and the user object for UI roles (Judge vs Coordinator)
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));

      // 3. Show a success message
      setMsg(`Welcome, ${res.data.username}! Redirecting...`);

      // This gives the user time to see the "Welcome" message before moving
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setLoading(false);
      
      // If the server sent a specific error message (e.g., "Invalid credentials"), show it.
      // Otherwise, show a generic error.
      const errorMsg = err.response?.data?.message || 'Login failed. Please check your connection.';
      setMsg(errorMsg);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Project RZ2</h1>
        <p style={subtitleStyle}>Judging Portal Login</p>
        
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              style={inputStyle}
              required
              disabled={loading}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={inputStyle}
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            style={{ ...buttonStyle, backgroundColor: loading ? '#6c757d' : '#007bff' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        {/* Feedback Message (Green for success, Red for error) */}
        {msg && (
          <div style={{ 
            ...messageStyle, 
            backgroundColor: msg.includes('Welcome') ? '#d4edda' : '#f8d7da',
            color: msg.includes('Welcome') ? '#155724' : '#721c24',
            border: `1px solid ${msg.includes('Welcome') ? '#c3e6cb' : '#f5c6cb'}`
          }}>
            {msg}
          </div>
        )}
      </div>
      <p style={footerStyle}>© 2026 Master of IT Team - Project RZ2</p>
    </div>
  );
}

// 📱 MOBILE-FRIENDLY STYLES (CSS-in-JS)
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f4f7f6',
  padding: '20px',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
};

const cardStyle = {
  width: '100%',
  maxWidth: '400px',
  backgroundColor: '#fff',
  padding: '40px 30px',
  borderRadius: '16px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
  textAlign: 'center'
};

const titleStyle = { margin: '0', color: '#007bff', fontSize: '28px', fontWeight: '800' };
const subtitleStyle = { margin: '5px 0 30px 0', color: '#6c757d', fontSize: '14px' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const inputGroupStyle = { textAlign: 'left' };
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#495057', marginBottom: '5px', textTransform: 'uppercase' };
const inputStyle = { width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '16px', boxSizing: 'border-box' };
const buttonStyle = { width: '100%', padding: '14px', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.3s' };
const messageStyle = { marginTop: '20px', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: '500' };
const footerStyle = { marginTop: '20px', fontSize: '12px', color: '#adb5bd' };

export default Login;