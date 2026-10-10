import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationService } from '../services/applicationService';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import ApplicationTable from '../components/ApplicationTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import RequestError from '../components/RequestError';

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [jobTypeFilter, setJobTypeFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setApplications(await applicationService.getAll());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredApplications = useMemo(() => {
    const searchTerm = search.toLowerCase();
    return applications.filter((application) => {
      const matchesSearch =
        !searchTerm ||
        (application.company || '').toLowerCase().includes(searchTerm) ||
        (application.role || '').toLowerCase().includes(searchTerm);
      const matchesStatus = statusFilter === 'All' || application.status === statusFilter;
      const matchesJobType = jobTypeFilter === 'All' || application.jobType === jobTypeFilter;
      const matchesLocation = locationFilter === 'All' || application.location === locationFilter;
      return matchesSearch && matchesStatus && matchesJobType && matchesLocation;
    });
  }, [applications, search, statusFilter, jobTypeFilter, locationFilter]);

  const filters = [
    { key: 'status', value: statusFilter, onChange: setStatusFilter, options: [
      { value: 'All', label: 'All Status' },
      { value: 'Applied', label: 'Applied' },
      { value: 'Shortlisted', label: 'Shortlisted' },
      { value: 'Interview', label: 'Interview' },
      { value: 'Selected', label: 'Selected' },
      { value: 'Rejected', label: 'Rejected' }
    ] },
    { key: 'jobType', value: jobTypeFilter, onChange: setJobTypeFilter, options: [
      { value: 'All', label: 'All Job Types' },
      { value: 'Internship', label: 'Internship' },
      { value: 'Full Time', label: 'Full Time' },
      { value: 'Part Time', label: 'Part Time' },
      { value: 'Contract', label: 'Contract' }
    ] },
    { key: 'location', value: locationFilter, onChange: setLocationFilter, options: [
      { value: 'All', label: 'All Locations' },
      { value: 'Bengaluru', label: 'Bengaluru' },
      { value: 'Hyderabad', label: 'Hyderabad' },
      { value: 'Remote', label: 'Remote' },
      { value: 'Pune', label: 'Pune' },
      { value: 'Chennai', label: 'Chennai' }
    ] }
  ];

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await applicationService.remove(deleteId);
      setDeleteId(null);
      await loadData();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading applications" />;
  }

  return (
    <div className="page-stack">
      <div className="page-header-row">
        <div>
          <div className="section-kicker">Applications</div>
          <h2 className="page-title">Job Applications</h2>
        </div>
        <button className="btn btn-primary" type="button" onClick={() => navigate('/applications/add')}>Add Application</button>
      </div>

      <RequestError message={error} onRetry={loadData} />

      <div className="toolbar-row">
        <div className="flex-grow-1">
          <SearchBar value={search} onChange={setSearch} placeholder="Search company or role" />
        </div>
        <button className="btn btn-outline-secondary" type="button" onClick={() => {
          setSearch('');
          setStatusFilter('All');
          setJobTypeFilter('All');
          setLocationFilter('All');
        }}>
          Reset
        </button>
      </div>

      <FilterBar
        filters={filters.map((filter) => ({
          ...filter,
          value: filter.value,
          options: filter.options
        }))}
        onChange={(key, value) => {
          if (key === 'status') setStatusFilter(value);
          if (key === 'jobType') setJobTypeFilter(value);
          if (key === 'location') setLocationFilter(value);
        }}
      />

      {filteredApplications.length === 0 ? (
        <EmptyState title="No Applications Yet" message="Start tracking your job applications to understand your career progress." actionLabel="Add Your First Application" onAction={() => navigate('/applications/add')} />
      ) : (
        <div className="table-card card mt-4">
          <ApplicationTable
            applications={filteredApplications}
            onSelect={(application) => setSelectedApplication(application)}
            onEdit={(id) => navigate(`/applications/edit/${id}`)}
            onDelete={(id) => setDeleteId(id)}
          />
        </div>
      )}

      <Modal
        isOpen={Boolean(selectedApplication)}
        title={`${selectedApplication?.company || 'Application'} Details`}
        onClose={() => setSelectedApplication(null)}
        footer={
          <div className="d-flex justify-content-between w-100">
            <button type="button" className="btn btn-outline-secondary" onClick={() => setSelectedApplication(null)}>Close</button>
            <button type="button" className="btn btn-primary" onClick={() => navigate(`/applications/edit/${selectedApplication?.id}`)}>Edit</button>
          </div>
        }
      >
        {selectedApplication ? (
          <div className="application-detail-grid">
            <div><strong>Company</strong><span>{selectedApplication.company}</span></div>
            <div><strong>Job Role</strong><span>{selectedApplication.role}</span></div>
            <div><strong>Location</strong><span>{selectedApplication.location}</span></div>
            <div><strong>Job Type</strong><span>{selectedApplication.jobType}</span></div>
            <div><strong>Application Date</strong><span>{selectedApplication.applicationDate}</span></div>
            <div><strong>Salary</strong><span>{selectedApplication.salary}</span></div>
            <div><strong>Required Skills</strong><span>{(selectedApplication.requiredSkills || []).join(', ') || '—'}</span></div>
            <div><strong>Relevant Skills</strong><span>{(selectedApplication.relevantSkills || []).join(', ') || '—'}</span></div>
            <div><strong>Resume</strong><span>{selectedApplication.resumeVersion}</span></div>
            <div><strong>Status</strong><span>{selectedApplication.status}</span></div>
            <div className="detail-full"><strong>Notes</strong><span>{selectedApplication.notes || '—'}</span></div>
          </div>
        ) : null}
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete Application"
        message="Are you sure you want to delete this application?"
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
