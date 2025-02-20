import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login form submitted'); // Debugging line
    try {
      const response = await axios.post('https://localhost:3000/api/sessions', {
        email,
        password,
      });
      console.log('Login successful:', response.data); // Debugging line
      setMessage(response.data.message);
      // Store user ID or token as needed
      localStorage.setItem('user_id', response.data.user_id);
      // Redirect to the dashboard
      console.log('Navigating to dashboard'); // Debugging line
      navigate('/');
    } catch (error) {
      console.error('Login error:', error); // Debugging line
      if (error.response) {
        console.error('Error response data:', error.response.data); // Debugging line
        setMessage(error.response.data.error);
      } else {
        setMessage('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
