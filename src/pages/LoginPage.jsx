import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const initialForm = { email: '', password: '' };

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.email.trim()) nextErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Enter a valid email.';
    if (!form.password) nextErrors.password = 'Password is required.';
    else if (form.password.length < 6) nextErrors.password = 'Password must be at least 6 characters.';
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
      const user = await login(form);
      navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (error) {
      setErrors({ submit: error.message || 'Login failed.' });
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-panel card shadow-sm">
        <div className="auth-panel-copy">
          <div className="brand-mark large">C</div>
          <h1>Welcome back</h1>
          <p>Manage your applications, interviews, and career growth in one powerful dashboard.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <h2>Sign in</h2>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              value={form.email}
              onChange={(event) => handleChange('email', event.target.value)}
              placeholder="you@example.com"
            />
            {errors.email ? <div className="invalid-feedback d-block">{errors.email}</div> : null}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              value={form.password}
              onChange={(event) => handleChange('password', event.target.value)}
              placeholder="••••••••"
            />
            {errors.password ? <div className="invalid-feedback d-block">{errors.password}</div> : null}
          </div>

          <div className="form-row-between mb-3">
            <label className="checkbox-inline">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-link">Forgot password?</a>
          </div>

          {errors.submit ? <div className="alert alert-danger">{errors.submit}</div> : null}

          <button className="btn btn-primary w-100" type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Login'}
          </button>

          <div className="auth-footer">
            Need an account? <Link to="/register">Create one</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
