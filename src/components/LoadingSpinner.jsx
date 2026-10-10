export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="loading-panel text-center py-5">
      <div className="spinner-border text-primary mb-3" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <div>{text}</div>
    </div>
  );
}
