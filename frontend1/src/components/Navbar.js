import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/');
  };

  const handleHome = () => {
    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'student') {
      navigate('/student/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        📚 <span>Course Resource Library</span>
      </div>

      <div className="navbar-links">
        {!token ? (
          <>
            {location.pathname !== "/" && (
              <Link to="/">Login</Link>
            )}
            {location.pathname !== "/signup" && (
              <Link to="/signup">Signup</Link>
            )}
          </>
        ) : (
          <>
            {/* ✅ Show Home button for logged-in users */}
            <button onClick={handleHome} className="home-button">🏠 Home</button>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
