export default function CareerInsightCard({ title, content, emphasis }) {
  return (
    <div className="career-insight-card card h-100">
      <div className="card-body">
        <div className="insight-eyebrow">{title}</div>
        <h5>{emphasis}</h5>
        <p>{content}</p>
      </div>
    </div>
  );
}
