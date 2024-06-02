import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { setUserId } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/login', formData);
      const { userId, message } = response.data;

      localStorage.setItem('userId', userId);
      setUserId(userId);  // Update the user context

      setMessage(message);

      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } catch (error) {
      setMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login to your account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        </div>
        <div>
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/register">Register here</Link></p>
      {message && <p className="login-message">{message}</p>}
    </div>
  );
};

export default Login;
