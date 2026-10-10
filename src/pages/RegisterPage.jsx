import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const initialForm = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  college: '',
  degree: ''
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.fullName.trim()) nextErrors.fullName = 'Full name is required.';
    if (!form.email.trim()) nextErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Enter a valid email.';
    if (!form.password) nextErrors.password = 'Password is required.';
    else if (form.password.length < 8) nextErrors.password = 'Password must be at least 8 characters.';
    if (!form.confirmPassword) nextErrors.confirmPassword = 'Confirm your password.';
    else if (form.confirmPassword !== form.password) nextErrors.confirmPassword = 'Passwords do not match.';
    if (!form.college.trim()) nextErrors.college = 'College is required.';
    if (!form.degree.trim()) nextErrors.degree = 'Degree is required.';
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    try {
      await register(form);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1200);
    } catch (error) {
      setErrors({ submit: error.message || 'Registration failed.' });
    }
  };

  return (
    <div className="auth-shell register-shell">
      <div className="auth-panel card shadow-sm">
        <div className="auth-panel-copy">
          <div className="brand-mark large">C</div>
          <h1>Build your career</h1>
          <p>Track your job applications, prepare for interviews, and get actionable guidance.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <h2>Create account</h2>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Full Name</label>
              <input type="text" className={`form-control ${errors.fullName ? 'is-invalid' : ''}`} value={form.fullName} onChange={(event) => handleChange('fullName', event.target.value)} />
              {errors.fullName ? <div className="invalid-feedback d-block">{errors.fullName}</div> : null}
            </div>
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} value={form.email} onChange={(event) => handleChange('email', event.target.value)} />
              {errors.email ? <div className="invalid-feedback d-block">{errors.email}</div> : null}
            </div>
            <div className="col-md-6">
              <label className="form-label">Password</label>
              <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} value={form.password} onChange={(event) => handleChange('password', event.target.value)} />
              {errors.password ? <div className="invalid-feedback d-block">{errors.password}</div> : null}
            </div>
            <div className="col-md-6">
              <label className="form-label">Confirm Password</label>
              <input type="password" className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} value={form.confirmPassword} onChange={(event) => handleChange('confirmPassword', event.target.value)} />
              {errors.confirmPassword ? <div className="invalid-feedback d-block">{errors.confirmPassword}</div> : null}
            </div>
            <div className="col-md-6">
              <label className="form-label">College</label>
              <input type="text" className={`form-control ${errors.college ? 'is-invalid' : ''}`} value={form.college} onChange={(event) => handleChange('college', event.target.value)} />
              {errors.college ? <div className="invalid-feedback d-block">{errors.college}</div> : null}
            </div>
            <div className="col-md-6">
              <label className="form-label">Degree</label>
              <input type="text" className={`form-control ${errors.degree ? 'is-invalid' : ''}`} value={form.degree} onChange={(event) => handleChange('degree', event.target.value)} />
              {errors.degree ? <div className="invalid-feedback d-block">{errors.degree}</div> : null}
            </div>
          </div>

          {errors.submit ? <div className="alert alert-danger mt-3">{errors.submit}</div> : null}
          {success ? <div className="alert alert-success mt-3">{success}</div> : null}

          <button className="btn btn-primary w-100 mt-3" type="submit" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </button>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
