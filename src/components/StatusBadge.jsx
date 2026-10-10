const statusClasses = {
  Applied: 'status-applied',
  Shortlisted: 'status-shortlisted',
  Interview: 'status-interview',
  Selected: 'status-selected',
  Rejected: 'status-rejected'
};

export default function StatusBadge({ status }) {
  const className = statusClasses[status] || 'status-default';
  return <span className={`status-badge ${className}`}>{status}</span>;
}
