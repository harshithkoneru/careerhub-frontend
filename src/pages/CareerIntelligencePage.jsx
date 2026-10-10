import { useCallback, useEffect, useState } from 'react';
import { careerService } from '../services/careerService';
import CareerInsightCard from '../components/CareerInsightCard';
import RecommendationCard from '../components/RecommendationCard';
import CareerHealthCard from '../components/CareerHealthCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import RequestError from '../components/RequestError';

export default function CareerIntelligencePage() {
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadAnalysis = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setAnalysis(await careerService.getCareerAnalysis());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAnalysis(); }, [loadAnalysis]);
  if (loading) return <LoadingSpinner text="Loading career intelligence" />;
  if (error) return <div className="page-stack"><RequestError message={error} onRetry={loadAnalysis} /></div>;
  if (!analysis) return null;

  const rolePerformance = analysis.rolePerformance || [];
  const rejectionAnalysis = analysis.rejectionAnalysis || [];
  const recommendations = analysis.recommendations || [];
  const careerHealth = analysis.careerHealth || { score: 0, metrics: [] };
  const improvementList = analysis.improvementList || [];
  const topRole = rolePerformance.reduce((best, role) => (role.rate > (best?.rate ?? -1) ? role : best), null);

  return (
    <div className="page-stack">
      <div className="page-header-row">
        <div>
          <div className="section-kicker">Analytics</div>
          <h2 className="page-title">Career Intelligence</h2>
        </div>
      </div>

      <div className="intelligence-highlight card">
        <div className="card-body">
          <h3>Career progress and next steps</h3>
          <p className="lead">You have applied to {analysis.totalApplications} jobs.</p>
          <div className="analysis-stat-row">
            <span>{analysis.rejected} Rejected</span>
            <span>{analysis.shortlisted} Shortlisted</span>
            <span>{analysis.interviews} Interviews</span>
          </div>
          <div className="mt-3"><strong>Interview Conversion:</strong> {analysis.interviewConversion}%</div>
          <div className="mt-4">
            <h5>Current focus</h5>
            <div className="issue-box">{analysis.mainIssue}</div>
            <p className="mt-3">{analysis.mainIssueDescription}</p>
          </div>
        </div>
      </div>

      <div className="row g-3 mt-1">
        <div className="col-xl-6">
          <div className="card table-card h-100">
            <div className="card-body">
              <h4 className="mb-3">Role Performance</h4>
              {rolePerformance.length ? (
                <div className="table-responsive">
                  <table className="table custom-table">
                    <thead><tr><th>Job Role</th><th>Applications</th><th>Interviews</th><th>Rate</th></tr></thead>
                    <tbody>{rolePerformance.map((role) => (
                      <tr key={role.role}>
                        <td>{role.role}</td><td>{role.applications}</td><td>{role.interviews}</td><td>{role.rate}%</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              ) : <EmptyState title="No role data yet" message="Add applications to compare your results by role." />}
              <div className="best-role-box mt-3">
                <div className="best-role-label">Best Performing Role</div>
                <div className="best-role-name">{analysis.bestRole || topRole?.role || 'Not enough data yet'}</div>
                <div className="best-role-rate">Interview Rate: {analysis.bestRoleRate ?? topRole?.rate ?? 0}%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-6">
          <div className="card table-card h-100">
            <div className="card-body">
              <h4 className="mb-3">Recorded Rejection Reasons</h4>
              {rejectionAnalysis.length ? (
                <div className="rejection-list">
                  {rejectionAnalysis.map((reason) => (
                    <div className="rejection-row" key={reason.name}>
                      <span>{reason.name} ({reason.count})</span><strong>{reason.value}%</strong>
                    </div>
                  ))}
                </div>
              ) : <EmptyState title="No rejections recorded" message="If an application is rejected, save its reason to see useful patterns here." />}
              <div className="warning-box mt-4">
                <div className="warning-title">Main Improvement Area</div>
                <div className="warning-value">{analysis.mainImprovementArea}</div>
                <div className="warning-list">
                  {improvementList.map((item) => <div key={item}>- {item}</div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {recommendations.length ? (
        <div className="row g-3 mt-1">
          {recommendations.map((recommendation, index) => (
            <div className="col-md-4" key={recommendation.title}>
              <RecommendationCard title={recommendation.title} description={recommendation.description} index={index + 1} />
            </div>
          ))}
        </div>
      ) : null}

      <div className="row g-3 mt-1">
        <div className="col-xl-6">
          <CareerHealthCard score={careerHealth.score} metrics={careerHealth.metrics || []} />
        </div>
        <div className="col-xl-6">
          <div className="row g-3">
            <div className="col-12">
              <CareerInsightCard
                title="Career Pattern"
                emphasis={topRole?.role || analysis.bestRole || 'Build your application history'}
                content={topRole ? `Your interview rate for this role is ${topRole.rate}%. Use this result to guide your next applications.` : 'More application data will help identify the roles that fit you best.'}
              />
            </div>
            <div className="col-12">
              <CareerInsightCard
                title="Focus Area"
                emphasis={analysis.mainImprovementArea || 'Consistent preparation'}
                content={analysis.mainIssueDescription}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
