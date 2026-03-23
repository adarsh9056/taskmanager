import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getApiErrorMessage } from '../utils/http';
import { validateLoginForm } from '../utils/validation';

const defaultForm = {
  email: '',
  password: ''
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { pushToast } = useToast();

  const [formState, setFormState] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormState((currentFormState) => ({
      ...currentFormState,
      [field]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateLoginForm(formState);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      await login({
        email: formState.email.trim(),
        password: formState.password
      });
      navigate('/', { replace: true });
    } catch (error) {
      pushToast(getApiErrorMessage(error), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Access your dashboard, refresh active sessions automatically, and manage tasks securely."
      footer={
        <p>
          Need an account? <Link to="/register">Create one</Link>
        </p>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={formState.email}
            onChange={(event) => handleChange('email', event.target.value)}
            placeholder="you@example.com"
          />
          {errors.email ? <span className="field-error">{errors.email}</span> : null}
        </label>

        <label>
          Password
          <input
            type="password"
            value={formState.password}
            onChange={(event) => handleChange('password', event.target.value)}
            placeholder="Enter your password"
          />
          {errors.password ? <span className="field-error">{errors.password}</span> : null}
        </label>

        <button type="submit" className="button button-primary auth-submit" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </AuthLayout>
  );
}
