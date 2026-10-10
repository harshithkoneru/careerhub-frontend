import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { applicationService } from '../services/applicationService';
import RequestError from '../components/RequestError';
import LoadingSpinner from '../components/LoadingSpinner';

const initialForm = {
  company: '',
  role: '',
  jobType: 'Full Time',
  location: '',
  applicationDate: '',
  jobUrl: '',
  salary: '',
  requiredSkills: '',
  relevantSkills: '',
  resumeVersion: '',
  status: 'Applied',
  rejectionReason: 'Unknown',
  notes: ''
};

const statusOptions = ['Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];
const jobTypeOptions = ['Internship', 'Full Time', 'Part Time', 'Contract'];
const rejectionOptions = ['Resume Screening', 'Skills Mismatch', 'Technical Interview', 'HR Interview', 'Experience', 'Location', 'Salary', 'Other', 'Unknown'];

export default function ApplicationFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [requestError, setRequestError] = useState('');
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    applicationService.getById(id).then((application) => {
      if (application) {
        setForm({
          ...initialForm,
          ...application,
          jobType: application.jobType || initialForm.jobType,
          location: application.location || '',
          jobUrl: application.jobUrl || '',
          salary: application.salary || '',
          resumeVersion: application.resumeVersion || '',
          rejectionReason: application.rejectionReason || 'Unknown',
          notes: application.notes || '',
          requiredSkills: (application.requiredSkills || []).join(', '),
          relevantSkills: (application.relevantSkills || []).join(', ')
        });
      }
    }).catch((error) => setRequestError(error.message)).finally(() => setLoading(false));
  }, [id]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.company.trim()) nextErrors.company = 'Company is required.';
    if (!form.role.trim()) nextErrors.role = 'Job role is required.';
    if (!form.location.trim()) nextErrors.location = 'Location is required.';
    if (!form.applicationDate) nextErrors.applicationDate = 'Application date is required.';
    if (!form.requiredSkills.trim()) nextErrors.requiredSkills = 'Required skills are required.';
    if (!form.relevantSkills.trim()) nextErrors.relevantSkills = 'Relevant skills are required.';
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const payload = {
      ...form,
      id,
      requiredSkills: form.requiredSkills.split(',').map((item) => item.trim()).filter(Boolean),
      relevantSkills: form.relevantSkills.split(',').map((item) => item.trim()).filter(Boolean),
      jobUrl: form.jobUrl.trim() || null,
      salary: form.salary.trim() || null
    };

    setSaving(true);
    setRequestError('');
    try {
      await applicationService.save(payload);
      navigate('/applications');
    } catch (error) {
      setRequestError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading application" />;

  const currentStatusOptions = id
    ? {
        Applied: ['Applied', 'Shortlisted', 'Rejected'],
        Shortlisted: ['Shortlisted', 'Interview', 'Rejected'],
        Interview: ['Interview', 'Selected', 'Rejected'],
        Selected: ['Selected'],
        Rejected: ['Rejected']
      }[form.status] || statusOptions
    : ['Applied'];

  return (
    <div className="page-stack narrow-page">
      <div className="page-header-row">
        <div>
          <div className="section-kicker">Applications</div>
          <h2 className="page-title">{id ? 'Edit Application' : 'Add Application'}</h2>
        </div>
      </div>

      <RequestError message={requestError} />
      <form className="card form-card" onSubmit={handleSubmit} noValidate>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Company Name</label>
            <input className={`form-control ${errors.company ? 'is-invalid' : ''}`} value={form.company} onChange={(event) => handleChange('company', event.target.value)} />
            {errors.company ? <div className="invalid-feedback d-block">{errors.company}</div> : null}
          </div>
          <div className="col-md-6">
            <label className="form-label">Job Role</label>
            <input className={`form-control ${errors.role ? 'is-invalid' : ''}`} value={form.role} onChange={(event) => handleChange('role', event.target.value)} />
            {errors.role ? <div className="invalid-feedback d-block">{errors.role}</div> : null}
          </div>
          <div className="col-md-3">
            <label className="form-label">Job Type</label>
            <select className="form-select" value={form.jobType} onChange={(event) => handleChange('jobType', event.target.value)}>
              {jobTypeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Location</label>
            <input className={`form-control ${errors.location ? 'is-invalid' : ''}`} value={form.location} onChange={(event) => handleChange('location', event.target.value)} />
            {errors.location ? <div className="invalid-feedback d-block">{errors.location}</div> : null}
          </div>
          <div className="col-md-3">
            <label className="form-label">Application Date</label>
            <input type="date" className={`form-control ${errors.applicationDate ? 'is-invalid' : ''}`} value={form.applicationDate} onChange={(event) => handleChange('applicationDate', event.target.value)} />
            {errors.applicationDate ? <div className="invalid-feedback d-block">{errors.applicationDate}</div> : null}
          </div>
          <div className="col-md-3">
            <label className="form-label">Salary / Package</label>
            <input className={`form-control ${errors.salary ? 'is-invalid' : ''}`} value={form.salary} onChange={(event) => handleChange('salary', event.target.value)} />
            {errors.salary ? <div className="invalid-feedback d-block">{errors.salary}</div> : null}
          </div>
          <div className="col-md-12">
            <label className="form-label">Job URL</label>
            <input className="form-control" type="url" value={form.jobUrl} onChange={(event) => handleChange('jobUrl', event.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Required Skills</label>
            <textarea className={`form-control ${errors.requiredSkills ? 'is-invalid' : ''}`} value={form.requiredSkills} onChange={(event) => handleChange('requiredSkills', event.target.value)} rows="3" />
            {errors.requiredSkills ? <div className="invalid-feedback d-block">{errors.requiredSkills}</div> : null}
          </div>
          <div className="col-md-6">
            <label className="form-label">Your Relevant Skills</label>
            <textarea className={`form-control ${errors.relevantSkills ? 'is-invalid' : ''}`} value={form.relevantSkills} onChange={(event) => handleChange('relevantSkills', event.target.value)} rows="3" />
            {errors.relevantSkills ? <div className="invalid-feedback d-block">{errors.relevantSkills}</div> : null}
          </div>
          <div className="col-md-4">
            <label className="form-label">Resume Version</label>
            <input className="form-control" value={form.resumeVersion} onChange={(event) => handleChange('resumeVersion', event.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Application Status</label>
            <select className="form-select" value={form.status} onChange={(event) => handleChange('status', event.target.value)} disabled={!id}>
              {currentStatusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Rejection Reason</label>
            <select className="form-select" value={form.rejectionReason} onChange={(event) => handleChange('rejectionReason', event.target.value)}>
              {rejectionOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-12">
            <label className="form-label">Notes</label>
            <textarea className="form-control" rows="4" value={form.notes} onChange={(event) => handleChange('notes', event.target.value)} />
          </div>
        </div>

        <div className="form-actions mt-4">
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/applications')}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Application'}</button>
        </div>
      </form>
    </div>
  );
}
