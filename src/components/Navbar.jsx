import { FaBell, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar-title-wrap">
        <h1 className="topbar-title">CareerHub</h1>
      </div>
      <div className="topbar-actions">
        <button className="icon-button" type="button" aria-label="Notifications">
          <FaBell />
        </button>
        <div className="profile-chip">
          <span className="profile-name">{user?.fullName || 'User'}</span>
          <FaUserCircle className="profile-icon" />
        </div>
      </div>
    </header>
  );
}
