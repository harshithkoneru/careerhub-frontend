import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="not-found-page d-flex justify-content-center align-items-center text-center">
      <div>
        <div className="display-1 fw-bold text-primary">404</div>
        <h2>Page not found</h2>
        <p className="text-muted">The page you were looking for does not exist.</p>
        <Link to="/dashboard" className="btn btn-primary">Go to dashboard</Link>
      </div>
    </div>
  );
}
