import { useCallback, useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { adminService } from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import RequestError from '../components/RequestError';
import ConfirmDialog from '../components/ConfirmDialog';
import Modal from '../components/Modal';

const COLORS = ['#16877b', '#39a894', '#73c6ad', '#a2d8c5', '#cceadd'];

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [userTrends, setUserTrends] = useState([]);
  const [popularRoles, setPopularRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteUser, setDeleteUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const loadAdminData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [statsData, usersData, trendData, roleData] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers(),
        adminService.getUserTrends(),
        adminService.getPopularRoles()
      ]);
      setStats(statsData);
      setUsers(usersData);
      setUserTrends(trendData);
      setPopularRoles(roleData);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAdminData(); }, [loadAdminData]);

  const confirmDelete = async () => {
    if (!deleteUser) return;
    setError('');
    try {
      await adminService.deleteUser(deleteUser.id);
      setDeleteUser(null);
      await loadAdminData();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  if (loading) return <LoadingSpinner text="Loading admin dashboard" />;

  return (
    <div className="page-stack">
      <RequestError message={error} onRetry={loadAdminData} />
      <div className="page-header-row">
        <div>
          <div className="section-kicker">Admin</div>
          <h2 className="page-title">Admin Dashboard</h2>
        </div>
      </div>

      {stats ? (
        <>
          <div className="stats-grid">
            <div className="dashboard-card primary"><div className="card-label">Total Users</div><div className="card-value">{stats.totalUsers ?? 0}</div></div>
            <div className="dashboard-card success"><div className="card-label">Total Applications</div><div className="card-value">{stats.totalApplications ?? 0}</div></div>
            <div className="dashboard-card warning"><div className="card-label">Total Interviews</div><div className="card-value">{stats.totalInterviews ?? 0}</div></div>
            <div className="dashboard-card info"><div className="card-label">Total Selected</div><div className="card-value">{stats.totalSelected ?? 0}</div></div>
          </div>

          <div className="dashboard-grid mt-4">
            <div className="card chart-card">
              <div className="card-body">
                <h5>Applications by Status</h5>
                {stats.statusDistribution?.length ? (
                  <div style={{ width: '100%', height: 220 }}>
                    <ResponsiveContainer>
                      <BarChart data={stats.statusDistribution}>
                        <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip />
                        <Bar dataKey="value" fill="#16877b" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : <EmptyState title="No application data" message="Application totals will appear as users track their applications." />}
              </div>
            </div>

            <div className="card chart-card">
              <div className="card-body">
                <h5>Users Over Time</h5>
                {userTrends.length ? (
                  <div style={{ width: '100%', height: 220 }}>
                    <ResponsiveContainer>
                      <BarChart data={userTrends}>
                        <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis allowDecimals={false} /><Tooltip />
                        <Bar dataKey="users" fill="#16877b" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : <EmptyState title="No registration trends yet" message="New-account trends will appear here." />}
              </div>
            </div>

            <div className="card chart-card col-span-2">
              <div className="card-body">
                <h5>Popular Job Roles</h5>
                {popularRoles.length ? (
                  <div style={{ width: '100%', height: 220 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={popularRoles} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80}>
                          {popularRoles.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : <EmptyState title="No popular roles yet" message="Role popularity appears after applications are recorded." />}
              </div>
            </div>
          </div>
        </>
      ) : null}

      <div className="card mt-4">
        <div className="card-body">
          <h4 className="mb-3">Users</h4>
          <div className="table-responsive">
            <table className="table custom-table align-middle">
              <thead><tr><th>Name</th><th>Email</th><th>College</th><th>Applications</th><th>Role</th><th>Actions</th></tr></thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td><td>{user.email}</td><td>{user.college || '—'}</td><td>{user.applications ?? 0}</td><td>{user.role}</td>
                    <td className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-primary" type="button" onClick={() => setSelectedUser(user)}>View</button>
                      {user.role !== 'ADMIN' ? <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => setDeleteUser(user)}>Delete</button> : null}
                    </td>
                  </tr>
                ))}
                {!users.length ? <tr><td colSpan="6" className="text-center">No users found.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={Boolean(deleteUser)}
        title="Delete User"
        message={`Delete ${deleteUser?.name || 'this user'} and their CareerHub data? This cannot be undone.`}
        onCancel={() => setDeleteUser(null)}
        onConfirm={confirmDelete}
      />
      <Modal isOpen={Boolean(selectedUser)} title="User details" onClose={() => setSelectedUser(null)}>
        {selectedUser ? (
          <div className="application-detail-grid">
            <div><strong>Name</strong><span>{selectedUser.name}</span></div>
            <div><strong>Email</strong><span>{selectedUser.email}</span></div>
            <div><strong>College</strong><span>{selectedUser.college || '—'}</span></div>
            <div><strong>Role</strong><span>{selectedUser.role}</span></div>
            <div><strong>Applications</strong><span>{selectedUser.applications ?? 0}</span></div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
