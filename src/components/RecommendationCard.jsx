export default function RecommendationCard({ title, description, index }) {
  return (
    <div className="recommendation-card card h-100">
      <div className="card-body">
        <div className="recommendation-index">{index}</div>
        <h5>{title}</h5>
        <p>{description}</p>
      </div>
    </div>
  );
}
