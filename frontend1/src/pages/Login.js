import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';  // ✅ Add Link from react-router-dom
import './Login.css'; // If not already imported

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password
      });

      toast.success('Login successful!', { position: "top-center" });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('userId', res.data.userId);

      if (res.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student/dashboard');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data || 'Login failed!', { position: "top-center" });
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2 className="login-title">🔐 Login</h2>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <button type="submit" className="login-button">
          Login
        </button>

        {/* ✅ Add Create Account Link */}
        <div style={{ marginTop: '15px' }}>
          <span>Don't have an account? </span>
          <Link to="/signup" style={{ color: '#FFA500', fontWeight: 'bold', textDecoration: 'none' }}>
            Create Account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
