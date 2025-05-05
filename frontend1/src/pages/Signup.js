import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './Signup.css'; // External CSS

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // Default role
  const [adminKey, setAdminKey] = useState(''); // Only needed if admin selected
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const signupData = { username, email, password, role };
      if (role === 'admin') {
        signupData.adminKey = adminKey;
      }

      await axios.post('http://localhost:5000/api/users/signup', signupData);
      toast.success('Signup successful! Please login.', { position: "top-center" });
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data || 'Signup failed!', { position: "top-center" });
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSignup} className="signup-form">
        <h2 className="signup-title">📝 Signup</h2>

        <input
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="signup-input"
        />
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="signup-input"
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="signup-input"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="signup-input"
        >
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>

        {role === 'admin' && (
          <input
            type="text"
            placeholder="Admin Access Key"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            className="signup-input"
          />
        )}

        <button type="submit" className="signup-button">
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
