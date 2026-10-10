export default function DashboardCard({ title, value, subtitle, tone = 'primary' }) {
  return (
    <div className={`dashboard-card ${tone}`}>
      <div className="card-label">{title}</div>
      <div className="card-value">{value}</div>
      {subtitle ? <div className="card-subtitle">{subtitle}</div> : null}
    </div>
  );
}
