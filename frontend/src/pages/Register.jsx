import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getApiErrorMessage } from '../utils/http';
import { validateRegisterForm } from '../utils/validation';

const defaultForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
};

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
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

    const validationErrors = validateRegisterForm(formState);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      await register({
        name: formState.name.trim(),
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
      title="Create account"
      subtitle="Start with a secure account, then manage your tasks through a scalable full-stack workflow."
      footer={
        <p>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Full name
          <input
            type="text"
            value={formState.name}
            onChange={(event) => handleChange('name', event.target.value)}
            placeholder="Ada Lovelace"
          />
          {errors.name ? <span className="field-error">{errors.name}</span> : null}
        </label>

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
            placeholder="Minimum 8 characters"
          />
          {errors.password ? <span className="field-error">{errors.password}</span> : null}
        </label>

        <label>
          Confirm password
          <input
            type="password"
            value={formState.confirmPassword}
            onChange={(event) => handleChange('confirmPassword', event.target.value)}
            placeholder="Repeat your password"
          />
          {errors.confirmPassword ? <span className="field-error">{errors.confirmPassword}</span> : null}
        </label>

        <button type="submit" className="button button-primary auth-submit" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  );
}
