import { useCallback, useEffect, useState } from 'react';
import { resumeService } from '../services/resumeService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import RequestError from '../components/RequestError';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function ResumePage() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const loadResumes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setResumes(await resumeService.getAll());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadResumes(); }, [loadResumes]);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Choose a PDF file to upload.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('The resume must be 5 MB or smaller.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await resumeService.upload(file);
      await loadResumes();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const runResumeAction = async (action) => {
    setBusy(true);
    setError('');
    try {
      await action();
      await loadResumes();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDownload = async (resume) => {
    setBusy(true);
    setError('');
    try {
      const file = await resumeService.download(resume.id);
      const url = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = resume.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading resumes" />;

  return (
    <div className="page-stack narrow-page">
      <RequestError message={error} onRetry={loadResumes} />
      <div className="page-header-row">
        <div>
          <div className="section-kicker">Resume</div>
          <h2 className="page-title">My Resumes</h2>
        </div>
        <label className={`btn btn-primary ${busy ? 'disabled' : ''}`} htmlFor="resume-upload">{busy ? 'Please wait...' : 'Upload PDF'}</label>
        <input id="resume-upload" type="file" accept="application/pdf,.pdf" className="visually-hidden" onChange={handleUpload} disabled={busy} />
      </div>

      {resumes.length ? (
        <div className="row g-3">
          {resumes.map((resume) => (
            <div className="col-lg-6" key={resume.id}>
              <div className="card resume-card h-100">
                <div className="card-body d-flex justify-content-between align-items-start gap-3">
                  <div>
                    <h5>{resume.name}</h5>
                    <div className="text-muted">Uploaded: {resume.uploadedAt ? new Date(resume.uploadedAt).toLocaleDateString() : '—'}</div>
                    {resume.isDefault ? <span className="badge text-bg-primary mt-2">Default Resume</span> : null}
                  </div>
                  <div className="resume-actions d-flex flex-wrap gap-2">
                    <button type="button" className="btn btn-sm btn-outline-primary" disabled={busy} onClick={() => handleDownload(resume)}>Download</button>
                    <button type="button" className="btn btn-sm btn-outline-danger" disabled={busy} onClick={() => runResumeAction(() => resumeService.remove(resume.id))}>Delete</button>
                    {!resume.isDefault ? (
                      <button type="button" className="btn btn-sm btn-outline-success" disabled={busy} onClick={() => runResumeAction(() => resumeService.setDefault(resume.id))}>Set as Default</button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No resumes uploaded" message="Upload a PDF resume to keep the version you use for applications organized." />
      )}
    </div>
  );
}
