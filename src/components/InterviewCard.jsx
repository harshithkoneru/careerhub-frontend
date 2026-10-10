import StatusBadge from './StatusBadge';

export default function InterviewCard({ interview, onView, onEdit, onDelete }) {
  return (
    <div className="interview-card card h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h6>{interview.company}</h6>
            <small className="text-muted">{interview.role}</small>
          </div>
          <StatusBadge status={interview.status} />
        </div>

        <div className="interview-detail"><strong>Date:</strong> {interview.date}</div>
        <div className="interview-detail"><strong>Time:</strong> {interview.time}</div>
        <div className="interview-detail"><strong>Round:</strong> {interview.round}</div>
        <div className="interview-detail"><strong>Mode:</strong> {interview.mode}</div>
        {interview.interviewLink ? (
          <div className="interview-link"><a href={interview.interviewLink} target="_blank" rel="noreferrer">Join Link</a></div>
        ) : null}

        <div className="mt-3 d-flex gap-2 flex-wrap">
          <button className="btn btn-sm btn-outline-primary" type="button" onClick={() => onView(interview)}>View</button>
          <button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => onEdit(interview)}>Edit</button>
          <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => onDelete(interview.id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}
