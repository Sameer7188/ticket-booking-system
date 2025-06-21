import React, { useState } from 'react';
import api from '../../services/api';
import './Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      const res = await api.post('/auth/register', { name, email, password });
      setSuccess('Registration successful! You can now log in.');
      setName(''); setEmail(''); setPassword(''); setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="register-split-bg">
      <div className="register-ticket-form">
      <div className="register-ticket-logo">🎟️ Book <span>my</span> ticket</div>
        <h2 className="register-title">Create Account</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="register-input"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="register-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="register-input"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="register-input"
          />
          {error && <div className="register-error">{error}</div>}
          {success && <div className="register-success">{success}</div>}
          <button type="submit" className="register-btn">Sign up</button>
        </form>
        <div className="register-login-link">Already have an account? <a href="/login">Log in</a></div>
      </div>
      <div className="register-bg-image"></div>
    </div>
  );
};

export default Register; 