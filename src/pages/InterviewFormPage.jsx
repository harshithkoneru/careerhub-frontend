import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { interviewService } from '../services/interviewService';
import RequestError from '../components/RequestError';
import LoadingSpinner from '../components/LoadingSpinner';

const initialForm = {
  company: '',
  role: '',
  date: '',
  time: '',
  round: 'Technical',
  mode: 'Online',
  interviewLink: '',
  status: 'Upcoming',
  notes: ''
};

export default function InterviewFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const interviewId = searchParams.get('id');
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(Boolean(interviewId));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!interviewId) return;
    interviewService.getById(interviewId).then((interview) => {
      if (interview) {
        setForm({
          ...initialForm,
          ...interview,
          time: interview.time || '',
          interviewLink: interview.interviewLink || '',
          notes: interview.notes || '',
          applicationId: interview.applicationId || ''
        });
      }
    }).catch((requestError) => setError(requestError.message)).finally(() => setLoading(false));
  }, [interviewId]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await interviewService.save({ ...form, id: interviewId });
      navigate('/interviews');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading interview" />;

  return (
    <div className="page-stack narrow-page">
      <div className="page-header-row">
        <div>
          <div className="section-kicker">Interviews</div>
          <h2 className="page-title">{interviewId ? 'Edit Interview' : 'Add Interview'}</h2>
        </div>
      </div>

      <RequestError message={error} />
      <form className="card form-card" onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Company</label>
            <input className="form-control" value={form.company} onChange={(event) => handleChange('company', event.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Job Role</label>
            <input className="form-control" value={form.role} onChange={(event) => handleChange('role', event.target.value)} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Interview Date</label>
            <input type="date" className="form-control" value={form.date} onChange={(event) => handleChange('date', event.target.value)} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Interview Time</label>
            <input type="time" className="form-control" value={form.time} onChange={(event) => handleChange('time', event.target.value)} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Interview Round</label>
            <select className="form-select" value={form.round} onChange={(event) => handleChange('round', event.target.value)}>
              {['HR', 'Technical', 'Coding', 'Managerial', 'Final', 'Other'].map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Interview Mode</label>
            <select className="form-select" value={form.mode} onChange={(event) => handleChange('mode', event.target.value)}>
              {['Online', 'Offline', 'Phone'].map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Interview Link</label>
            <input className="form-control" value={form.interviewLink} onChange={(event) => handleChange('interviewLink', event.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={(event) => handleChange('status', event.target.value)}>
              {['Upcoming', 'Completed', 'Cancelled'].map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-12">
            <label className="form-label">Notes</label>
            <textarea rows="4" className="form-control" value={form.notes} onChange={(event) => handleChange('notes', event.target.value)} />
          </div>
        </div>

        <div className="form-actions mt-4">
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/interviews')}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Interview'}</button>
        </div>
      </form>
    </div>
  );
}
