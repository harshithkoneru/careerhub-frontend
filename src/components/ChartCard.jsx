export default function ChartCard({ title, subtitle, children }) {
  return (
    <div className="chart-card card h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="card-title mb-0">{title}</h5>
            {subtitle ? <small className="text-muted">{subtitle}</small> : null}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
