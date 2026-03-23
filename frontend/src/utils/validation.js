const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const validateLoginForm = (values) => {
  const errors = {};

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!emailPattern.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.password) {
    errors.password = 'Password is required.';
  }

  return errors;
};

export const validateRegisterForm = (values) => {
  const errors = validateLoginForm(values);

  if (!values.name.trim()) {
    errors.name = 'Full name is required.';
  } else if (values.name.trim().length < 2) {
    errors.name = 'Full name must be at least 2 characters.';
  }

  if (!passwordPattern.test(values.password)) {
    errors.password =
      'Use at least 8 characters with uppercase, lowercase, and a number.';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirm your password.';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
};

export const validateTaskForm = (values) => {
  const errors = {};

  if (!values.title.trim()) {
    errors.title = 'Title is required.';
  } else if (values.title.trim().length > 120) {
    errors.title = 'Title cannot exceed 120 characters.';
  }

  if (values.description.trim().length > 500) {
    errors.description = 'Description cannot exceed 500 characters.';
  }

  if (values.dueDate && Number.isNaN(Date.parse(values.dueDate))) {
    errors.dueDate = 'Choose a valid due date.';
  }

  return errors;
};
