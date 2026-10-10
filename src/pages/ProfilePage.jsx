import { useCallback, useEffect, useState } from 'react';
import { profileService } from '../services/profileService';
import LoadingSpinner from '../components/LoadingSpinner';
import RequestError from '../components/RequestError';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setProfile(await profileService.getProfile());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const updatedProfile = await profileService.updateProfile({
        ...profile,
        graduationYear: profile.graduationYear === '' ? null : Number(profile.graduationYear)
      });
      setProfile(updatedProfile);
      updateUser(updatedProfile);
      setIsEditing(false);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading profile" />;

  return (
    <div className="page-stack narrow-page">
      <RequestError message={error} onRetry={loadProfile} />
      <div className="page-header-row">
        <div>
          <div className="section-kicker">Profile</div>
          <h2 className="page-title">Profile</h2>
        </div>
        <button className="btn btn-primary" type="button" onClick={() => setIsEditing((prev) => !prev)}>
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <form className="card form-card" onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Full Name</label>
            <input className="form-control" value={profile.fullName || ''} disabled={!isEditing} onChange={(event) => handleChange('fullName', event.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input className="form-control" value={profile.email || ''} disabled={!isEditing} onChange={(event) => handleChange('email', event.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Phone</label>
            <input className="form-control" value={profile.phone || ''} disabled={!isEditing} onChange={(event) => handleChange('phone', event.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">College</label>
            <input className="form-control" value={profile.college || ''} disabled={!isEditing} onChange={(event) => handleChange('college', event.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Degree</label>
            <input className="form-control" value={profile.degree || ''} disabled={!isEditing} onChange={(event) => handleChange('degree', event.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Graduation Year</label>
            <input className="form-control" value={profile.graduationYear || ''} disabled={!isEditing} onChange={(event) => handleChange('graduationYear', event.target.value)} />
          </div>
          <div className="col-md-12">
            <label className="form-label">Skills</label>
            <input className="form-control" value={profile.skills || ''} disabled={!isEditing} onChange={(event) => handleChange('skills', event.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="form-label">LinkedIn</label>
            <input className="form-control" value={profile.linkedIn || ''} disabled={!isEditing} onChange={(event) => handleChange('linkedIn', event.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="form-label">GitHub</label>
            <input className="form-control" value={profile.github || ''} disabled={!isEditing} onChange={(event) => handleChange('github', event.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Portfolio</label>
            <input className="form-control" value={profile.portfolio || ''} disabled={!isEditing} onChange={(event) => handleChange('portfolio', event.target.value)} />
          </div>
        </div>

        {isEditing ? (
          <div className="form-actions mt-4">
            <button type="button" className="btn btn-outline-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          </div>
        ) : null}
      </form>
    </div>
  );
}
