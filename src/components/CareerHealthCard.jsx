export default function CareerHealthCard({ score, metrics }) {
  return (
    <div className="career-health-card card h-100">
      <div className="card-body">
        <h4 className="mb-3">Career Health</h4>
        <div className="score-row">
          <span className="score-value">{score}</span>
          <span className="score-scale">/ 100</span>
        </div>

        <div className="metrics-list mt-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="metric-row">
              <div className="metric-label">{metric.label}</div>
              <div className="metric-value">{metric.value}%</div>
              <div className="progress custom-progress">
                <div className="progress-bar" style={{ width: `${metric.value}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
