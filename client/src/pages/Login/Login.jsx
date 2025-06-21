import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in both fields');
      return;
    }

    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-dark-container">
      <div className="login-logo">🎟️ Book <span>my</span> ticket</div>

      <h2 className="login-heading">Login</h2>
      <p className="login-subtext">Please login to continue with your account</p>

      <form className="login-form-dark" onSubmit={handleSubmit}>
        <label>Email Address</label>
        <input
          type="email"
          placeholder="xyz123@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <div className="password-field">
          <input
            type={showPass ? 'text' : 'password'}
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span onClick={() => setShowPass(!showPass)} className="eye-toggle">
            {showPass ? '🙈' : '👁️'}
          </span>
        </div>

        <div className="forgot-password">
          <Link to="/forgot">Forgot Password?</Link>
        </div>

        {error && <div className="login-error">{error}</div>}

        <button type="submit" className="login-submit-btn">Login</button>
      </form>

      <div className="divider"><span>OR</span></div>


      <p className="signup-link">
        Don’t have an account? <Link to="/register">Signup</Link>
      </p>
    </div>
  );
};

export default Login;
