import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout, isAdmin } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/dashboard" className="navbar-brand">
          🍬 Sweet Shop
        </Link>
        <div className="navbar-menu">
          <Link to="/dashboard" className="navbar-link">
            Dashboard
          </Link>
          {isAdmin() && (
            <Link to="/admin" className="navbar-link">
              Admin Panel
            </Link>
          )}
          <div className="navbar-user">
            <span className="navbar-user-name">
              {user.name} {isAdmin() && <span className="badge badge-primary">Admin</span>}
            </span>
            <button onClick={logout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
