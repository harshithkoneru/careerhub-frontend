import StatusBadge from './StatusBadge';

export default function ApplicationCard({ application, onSelect }) {
  return (
    <div className="application-card card h-100" onClick={() => onSelect(application)} role="button" tabIndex={0} onKeyDown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onSelect(application);
      }
    }}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h6 className="mb-1">{application.company}</h6>
            <small className="text-muted">{application.role}</small>
          </div>
          <StatusBadge status={application.status} />
        </div>
        <div className="app-meta-row">
          <span>{application.location}</span>
          <span>{application.jobType}</span>
        </div>
        <div className="app-meta-row">
          <span>{application.applicationDate}</span>
          <span>{application.salary}</span>
        </div>
      </div>
    </div>
  );
}
