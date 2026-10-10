import StatusBadge from './StatusBadge';

export default function ApplicationTable({ applications, onSelect, onEdit, onDelete }) {
  return (
    <div className="table-responsive">
      <table className="table application-table align-middle">
        <thead>
          <tr>
            <th>Company</th>
            <th>Job Role</th>
            <th>Applied Date</th>
            <th>Status</th>
            <th>Resume</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application.id}>
              <td className="fw-semibold">{application.company}</td>
              <td>{application.role}</td>
              <td>{application.applicationDate}</td>
              <td><StatusBadge status={application.status} /></td>
              <td>{application.resumeVersion}</td>
              <td>
                <div className="table-actions d-flex gap-2">
                  <button type="button" className="btn btn-sm btn-link" onClick={() => onSelect(application)}>View</button>
                  <button type="button" className="btn btn-sm btn-link text-secondary" onClick={() => onEdit(application.id)}>Edit</button>
                  <button type="button" className="btn btn-sm btn-link text-danger" onClick={() => onDelete(application.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
