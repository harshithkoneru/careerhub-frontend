export default function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <div className="empty-state card card-body text-center">
      <div className="empty-state-icon">📋</div>
      <h4>{title}</h4>
      <p>{message}</p>
      {actionLabel ? (
        <button className="btn btn-primary mt-3" type="button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
