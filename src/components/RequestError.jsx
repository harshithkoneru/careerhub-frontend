export default function RequestError({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="alert alert-danger d-flex align-items-center justify-content-between gap-3" role="alert">
      <span>{message}</span>
      {onRetry ? <button className="btn btn-sm btn-outline-danger" type="button" onClick={onRetry}>Retry</button> : null}
    </div>
  );
}
