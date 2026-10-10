import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import DashboardCard from '../components/DashboardCard';
import ChartCard from '../components/ChartCard';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import RequestError from '../components/RequestError';
import { dashboardService } from '../services/dashboardService';

const COLORS = ['#16877b', '#39a894', '#73c6ad', '#a2d8c5', '#cceadd'];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setDashboard(await dashboardService.getDashboard());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  if (loading) return <LoadingSpinner text="Loading your dashboard" />;
  if (error) return <div className="page-stack"><RequestError message={error} onRetry={loadDashboard} /></div>;
  if (!dashboard) return null;

  const stats = dashboard.stats || {};
  const recentApplications = dashboard.recentApplications || [];
  const upcomingInterviews = dashboard.upcomingInterviews || [];
  const rolePerformance = dashboard.rolePerformance || [];
  const statusChart = dashboard.statusChart || [];
  const monthlyApplications = dashboard.monthlyApplications || [];
  const rejectionReasons = dashboard.rejectionReasons || [];

  return (
    <div className="page-stack">
      <div className="page-header-row">
        <div>
          <div className="section-kicker">Overview</div>
          <h2 className="page-title">Dashboard</h2>
        </div>
        <button className="btn btn-primary" type="button" onClick={() => navigate('/applications/add')}>Add Application</button>
      </div>

      <div className="stats-grid">
        <DashboardCard title="Total Applications" value={stats.totalApplications ?? 0} subtitle="Tracked applications" tone="primary" />
        <DashboardCard title="Shortlisted" value={stats.shortlisted ?? 0} subtitle="Moving forward" tone="success" />
        <DashboardCard title="Interviews" value={stats.interviews ?? 0} subtitle="Interview stage" tone="warning" />
        <DashboardCard title="Selected" value={stats.selected ?? 0} subtitle="Offers received" tone="info" />
        <DashboardCard title="Rejected" value={stats.rejected ?? 0} subtitle="Review your learnings" tone="danger" />
      </div>

      <div className="summary-inline row g-3 mt-2">
        <div className="col-lg-6">
          <div className="mini-stat-box card h-100">
            <div className="mini-stat-label">Interview Conversion</div>
            <div className="mini-stat-value">{stats.interviewConversionRate ?? stats.interviewConversion ?? 0}%</div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="mini-stat-box card h-100">
            <div className="mini-stat-label">Selection Rate</div>
            <div className="mini-stat-value">{stats.selectionRate ?? 0}%</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid mt-4">
        <ChartCard title="Application Status" subtitle="Current pipeline">
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={statusChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#16877b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Applications Over Time" subtitle="Monthly application activity">
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <AreaChart data={monthlyApplications}>
                <defs>
                  <linearGradient id="fillColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16877b" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#16877b" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Area type="monotone" dataKey="applications" stroke="#16877b" fill="url(#fillColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Job Role Performance" subtitle="Interview rate by role">
          {rolePerformance.length ? (
            <div className="role-performance-list">
              {rolePerformance.map((role) => (
                <div key={role.role} className="progress-item">
                  <div className="progress-header">
                    <span>{role.role}</span>
                    <strong>{role.rate ?? 0}%</strong>
                  </div>
                  <div className="progress custom-progress">
                    <div className="progress-bar" style={{ width: `${Math.min(100, role.rate || 0)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : <EmptyState title="No role data yet" message="Role performance appears after you add applications." />}
        </ChartCard>

        <ChartCard title="Rejection Reasons" subtitle="Recorded application outcomes">
          {rejectionReasons.length ? (
            <div style={{ width: '100%', height: 240 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={rejectionReasons} dataKey="value" nameKey="name" innerRadius={45} outerRadius={82} paddingAngle={4}>
                    {rejectionReasons.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : <EmptyState title="No rejection data" message="Rejection analytics appear when application outcomes are recorded." />}
        </ChartCard>
      </div>

      <div className="section-block mt-4">
        <div className="section-header mb-3">
          <h3>Upcoming Interviews</h3>
          <button className="btn btn-outline-primary btn-sm" type="button" onClick={() => navigate('/interviews')}>View All</button>
        </div>
        {upcomingInterviews.length ? (
          <div className="upcoming-interview-list">
            {upcomingInterviews.map((interview) => (
              <div className="interview-mini card" key={interview.id}>
                <div className="interview-mini-header">
                  <strong>{interview.company}</strong>
                  <StatusBadge status={interview.status || 'Upcoming'} />
                </div>
                <div className="interview-mini-role">{interview.role}</div>
                <div className="interview-mini-date">{interview.date} | {interview.time || 'Time not set'}</div>
                <div className="interview-mini-round">{interview.round}</div>
                <div className="mini-btn-row">
                  <button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => navigate('/interviews')}>Manage Interviews</button>
                </div>
              </div>
            ))}
          </div>
        ) : <EmptyState title="No upcoming interviews" message="Scheduled interviews will appear here." actionLabel="Add Interview" onAction={() => navigate('/interviews/add')} />}
      </div>

      <div className="section-block mt-4">
        <div className="section-header mb-3">
          <h3>Recent Applications</h3>
          <button className="btn btn-outline-primary btn-sm" type="button" onClick={() => navigate('/applications')}>Manage</button>
        </div>
        <div className="table-responsive">
          <table className="table custom-table align-middle">
            <thead>
              <tr><th>Company</th><th>Job Role</th><th>Applied Date</th><th>Status</th><th>Resume</th></tr>
            </thead>
            <tbody>
              {recentApplications.map((app) => (
                <tr key={app.id}>
                  <td>{app.company}</td>
                  <td>{app.role}</td>
                  <td>{app.applicationDate}</td>
                  <td><StatusBadge status={app.status} /></td>
                  <td>{app.resumeVersion || '—'}</td>
                </tr>
              ))}
              {!recentApplications.length ? <tr><td colSpan="5" className="text-center">No applications yet. Add an application to start tracking your search.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
