import React, { useState } from 'react';
import {
  Link as RouterLink,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import {
  Globe,
  Eye,
  ChevronDown,
  LogOut,
  CalendarDays,
  FileText,
  Home,
  Landmark,
  Library,
  LogIn,
  Mail,
  Search,
  UserPlus,
} from 'lucide-react';

const navItems = [
  {
    label: 'Home',
    to: '/',
    icon: Home,
  },
  {
    label: 'How It Works',
    to: '/how-it-works',
    icon: FileText,
  },
  {
    label: 'Department',
    to: '/government/challenges',
    icon: Landmark,
    menu: [
      {
        label: 'Department Overview',
        to: '/government/dashboard',
      },
      {
        label: 'Manage Challenges',
        to: '/government/challenges',
      },
      {
        label: 'Post a Challenge',
        to: '/government/create-challenge',
      },
    ],
  },
  {
    label: 'Events',
    to: '/success-stories',
    icon: CalendarDays,
  },
  {
    label: 'Resources',
    to: '/templates',
    icon: Library,
  },
  {
    label: 'Contact',
    to: '/contact',
    icon: Mail,
  },
];

const Navbar = ({ currentUser, onRoleChange }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [lang, setLang] = useState('EN');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }

    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    if (onRoleChange) {
      onRoleChange(null);
    }

    setShowRoleDropdown(false);
    navigate('/login');
  };

  return (
    <header className="navbar-header egovt-header">

      {/* Government Top Bar */}
      <div className="govt-top-bar">
        <div className="govt-top-left">
          <img
            src="/maharashtra-emblem.svg"
            alt="Government of Maharashtra emblem"
            style={{
              width: 24,
              height: 24,
              objectFit: 'contain',
            }}
          />

          <span style={{ fontWeight: 700 }}>
            Government of Maharashtra
          </span>
        </div>

        <div className="govt-top-right">
          <button
            type="button"
            className="top-bar-btn"
            onClick={() =>
              setLang(lang === 'EN' ? 'MR' : 'EN')
            }
          >
            <Globe
              size={12}
              style={{
                display: 'inline',
                marginRight: '6px',
              }}
            />

            {lang === 'EN' ? 'मराठी' : 'English'}
          </button>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="navbar-container">

        {/* Brand */}
        <RouterLink
          to="/"
          className="brand-section"
          aria-label="Samarth home"
        >
          <img
            src="/logo-icon.png"
            alt="Samarth logo"
            className="brand-emblem"
            style={{
              width: 40,
              height: 40,
            }}
          />

          <div className="brand-divider" />

          <div className="brand-meta">
            <div
              style={{
                fontSize: '1.15rem',
                fontWeight: 800,
                color: 'var(--primary-navy)',
                letterSpacing: 0.4,
              }}
            >
              Samarth
            </div>

            <div
              style={{
                fontSize: '0.68rem',
                color: '#64748B',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Innovation Procurement Portal
            </div>
          </div>
        </RouterLink>

        {/* Navigation Links */}
        <nav
          className="text-navigation"
          aria-label="Main navigation"
        >
          <ul className="nav-links">

            {navItems.map(
              ({ label, to, icon: Icon, menu }) => (
                <li
                  key={to}
                  className={menu ? 'has-submenu' : ''}
                >
                  <RouterLink
                    to={to}
                    className={`nav-item-link ${
                      isActive(to) ? 'active' : ''
                    }`}
                  >
                    <Icon size={14} />

                    <span>{label}</span>

                    {menu && (
                      <ChevronDown size={13} />
                    )}
                  </RouterLink>

                  {/* Department Dropdown */}
                  {menu && (
                    <div className="nav-submenu">
                      {menu.map((entry) => (
                        <RouterLink
                          key={entry.to}
                          to={entry.to}
                        >
                          {entry.label}
                        </RouterLink>
                      ))}
                    </div>
                  )}
                </li>
              )
            )}

          </ul>
        </nav>

        {/* Right Side Actions */}
        <div
          className="nav-actions"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >

          {/* Search */}
          <button
            type="button"
            className="nav-search"
            aria-label="Search"
            title="Search"
          >
            <Search size={18} />
          </button>

          {/* Accessibility */}
          <button
            type="button"
            className="nav-search"
            aria-label="Accessibility"
            title="Accessibility"
          >
            <Eye size={18} />
          </button>

          {/* Login */}
          <button
            type="button"
            className="nav-login auth-icon btn btn-outline"
            onClick={() => navigate('/login')}
            aria-label="Login"
            title="Login"
          >
            <LogIn size={18} />
            <span>LOGIN</span>
          </button>

          {/* Register */}
          <button
            type="button"
            className="nav-register auth-icon btn btn-apply"
            onClick={() => navigate('/login')}
            aria-label="Register"
            title="Register"
          >
            <UserPlus size={18} />
            <span>REGISTER</span>
          </button>

          {/* Post Challenge */}
          <RouterLink
            to="/government/create-challenge"
            className="btn btn-apply"
          >
            POST A CHALLENGE
          </RouterLink>

          {/* User Profile */}
          {currentUser && (
            <div
              style={{
                position: 'relative',
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setShowRoleDropdown(
                    !showRoleDropdown
                  )
                }
                className="user-profile-badge"
                aria-label="User menu"
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name || 'User'}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                    }}
                  />
                ) : (
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#E2E8F0',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    {currentUser.name
                      ? currentUser.name
                          .charAt(0)
                          .toUpperCase()
                      : 'U'}
                  </span>
                )}

                <ChevronDown size={14} />
              </button>

              {/* User Dropdown */}
              {showRoleDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '110%',
                    width: 220,
                    background: '#FFFFFF',
                    borderRadius: 12,
                    boxShadow:
                      '0 10px 25px rgba(0,0,0,0.12)',
                    padding: 8,
                    zIndex: 1000,
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <div
                    style={{
                      padding: '8px 10px',
                      borderBottom:
                        '1px solid #E2E8F0',
                      marginBottom: 6,
                    }}
                  >
                    <strong
                      style={{
                        display: 'block',
                        color: '#0B2545',
                      }}
                    >
                      {currentUser.name ||
                        'User'}
                    </strong>

                    {currentUser.email && (
                      <small
                        style={{
                          color: '#64748B',
                        }}
                      >
                        {currentUser.email}
                      </small>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '9px 10px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      color: '#C53030',
                      fontWeight: 700,
                      textAlign: 'left',
                      borderRadius: 6,
                    }}
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Announcement Ribbon */}
      <div className="announcement-ribbon">
        <div className="announcement-inner">

          <div className="announcement-tag">
            Update
          </div>

          <div className="announcement-text">
            New Challenge Window Open — Urban
            Development Dept, closes 15 Oct 2026
          </div>

        </div>
      </div>

    </header>
  );
};

export default Navbar;
