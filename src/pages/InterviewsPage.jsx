import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewService } from '../services/interviewService';
import InterviewCard from '../components/InterviewCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import Modal from '../components/Modal';
import RequestError from '../components/RequestError';

export default function InterviewsPage() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setInterviews(await interviewService.getAll());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onDelete = async () => {
    if (!deleteId) return;
    try {
      await interviewService.remove(deleteId);
      setDeleteId(null);
      await loadData();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const upcoming = interviews.filter((item) => item.status === 'Upcoming');
  const completed = interviews.filter((item) => item.status === 'Completed');
  const cancelled = interviews.filter((item) => item.status === 'Cancelled');

  if (loading) return <LoadingSpinner text="Loading interviews" />;

  return (
    <div className="page-stack">
      <RequestError message={error} onRetry={loadData} />
      <div className="page-header-row">
        <div>
          <div className="section-kicker">Interviews</div>
          <h2 className="page-title">Interview Management</h2>
        </div>
        <button className="btn btn-primary" type="button" onClick={() => navigate('/interviews/add')}>Add Interview</button>
      </div>

      <div className="interview-section">
        <h3>Upcoming Interviews</h3>
        {upcoming.length ? (
          <div className="row g-3">
            {upcoming.map((interview) => (
              <div className="col-lg-6" key={interview.id}>
                <InterviewCard
                  interview={interview}
                  onView={() => setSelectedInterview(interview)}
                  onEdit={() => navigate(`/interviews/add?id=${interview.id}`)}
                  onDelete={(id) => setDeleteId(id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No interviews scheduled" message="Once you add interviews, they will appear here." />
        )}
      </div>

      <div className="interview-section mt-4">
        <h3>Completed Interviews</h3>
        {completed.length ? (
          <div className="row g-3">
            {completed.map((interview) => (
              <div className="col-lg-6" key={interview.id}>
                <InterviewCard
                  interview={interview}
                  onView={() => setSelectedInterview(interview)}
                  onEdit={() => navigate(`/interviews/add?id=${interview.id}`)}
                  onDelete={(id) => setDeleteId(id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No completed interviews" message="Your completed interview history will appear here." />
        )}
      </div>

      <div className="interview-section mt-4">
        <h3>Cancelled Interviews</h3>
        {cancelled.length ? (
          <div className="row g-3">
            {cancelled.map((interview) => (
              <div className="col-lg-6" key={interview.id}>
                <InterviewCard
                  interview={interview}
                  onView={() => setSelectedInterview(interview)}
                  onEdit={() => navigate(`/interviews/add?id=${interview.id}`)}
                  onDelete={(id) => setDeleteId(id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No cancelled interviews" message="No cancelled interview records yet." />
        )}
      </div>

      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete Interview"
        message="Are you sure you want to delete this interview?"
        onCancel={() => setDeleteId(null)}
        onConfirm={onDelete}
      />
      <Modal
        isOpen={Boolean(selectedInterview)}
        title={`${selectedInterview?.company || 'Interview'} details`}
        onClose={() => setSelectedInterview(null)}
      >
        {selectedInterview ? (
          <div className="application-detail-grid">
            <div><strong>Company</strong><span>{selectedInterview.company}</span></div>
            <div><strong>Role</strong><span>{selectedInterview.role}</span></div>
            <div><strong>Date</strong><span>{selectedInterview.date}</span></div>
            <div><strong>Time</strong><span>{selectedInterview.time || '—'}</span></div>
            <div><strong>Round</strong><span>{selectedInterview.round}</span></div>
            <div><strong>Mode</strong><span>{selectedInterview.mode}</span></div>
            <div><strong>Status</strong><span>{selectedInterview.status}</span></div>
            <div className="detail-full"><strong>Notes</strong><span>{selectedInterview.notes || '—'}</span></div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
