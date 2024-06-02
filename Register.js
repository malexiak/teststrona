import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext'; // Import UserContext
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthdate: ''
  });

  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { setUserId } = useContext(UserContext); // Use UserContext

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    const { confirmPassword, ...dataToSend } = formData;

    try {
      const response = await axios.post('http://localhost:5000/register', dataToSend);
      const { userId, message } = response.data;

      localStorage.setItem('userId', userId);
      setUserId(userId);  // Update the user context

      setMessage(message);

      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setMessage("Email already exists");
      } else {
        setMessage("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="register-container">
      <h2>Create new account</h2>
      <form onSubmit={handleSubmit}>
        <div className="name-inputs">
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder='First Name' required />
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder='Last Name' required />
        </div>
        <div>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder='Email' required />
        </div>
        <div>
          <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder='Password' required />
          <span className="password-toggle" onClick={togglePasswordVisibility}>
            {showPassword ? (
              <i className="fas fa-eye-slash"></i>
            ) : (
              <i className="fas fa-eye"></i>
            )}
          </span>
        </div>
        <div>
          <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder='Confirm Password' required />
          <span className="confirmPassword-toggle" onClick={toggleConfirmPasswordVisibility}>
            {showConfirmPassword ? (
              <i className="fas fa-eye-slash"></i>
            ) : (
              <i className="fas fa-eye"></i>
            )}
          </span>
        </div>
        <div>
          <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} placeholder='Birthdate' required />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login here</Link></p>
      {message && <p className="register-message">{message}</p>}
    </div>
  );
};

export default Register;
