import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaBriefcase, FaCalendarAlt, FaBrain, FaFileAlt, FaUser, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
  { to: '/applications', label: 'Applications', icon: FaBriefcase },
  { to: '/interviews', label: 'Interviews', icon: FaCalendarAlt },
  { to: '/career-intelligence', label: 'Intelligence', icon: FaBrain },
  { to: '/resume', label: 'Resume', icon: FaFileAlt },
  { to: '/profile', label: 'Profile', icon: FaUser }
];

export default function Sidebar() {
  const { logout, user } = useAuth();
  const visibleItems = user?.role === 'ADMIN'
    ? [{ to: '/admin', label: 'Admin', icon: FaTachometerAlt }, ...navItems]
    : navItems;

  return (
    <aside className="sidebar">
      <div className="sidebar-header d-flex align-items-center justify-content-between">
        <div className="brand-wrap">
          <div className="brand-mark">C</div>
          <div>
            <div className="brand-title">CareerHub</div>
          </div>
        </div>
        <button className="mobile-nav-toggle" type="button" aria-label="Toggle navigation">
          <FaBars />
        </button>
      </div>

      <nav className="sidebar-nav">
        {visibleItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            end={to === '/dashboard'}
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="logout-btn" type="button" onClick={logout}>
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
    </aside>
  );
}
