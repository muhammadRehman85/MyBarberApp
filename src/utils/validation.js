// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Phone number validation
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Name validation
export const isValidName = (name) => {
  return name && name.trim().length >= 2;
};

// Required field validation
export const isRequired = (value) => {
  return value && value.trim().length > 0;
};

// Form validation helpers
export const validateForm = (formData, validationRules) => {
  const errors = {};
  
  Object.keys(validationRules).forEach(field => {
    const value = formData[field];
    const rules = validationRules[field];
    
    if (rules.required && !isRequired(value)) {
      errors[field] = `${field} is required`;
    } else if (value) {
      if (rules.email && !isValidEmail(value)) {
        errors[field] = 'Please enter a valid email address';
      }
      if (rules.password && !isValidPassword(value)) {
        errors[field] = 'Password must be at least 8 characters with uppercase, lowercase, and number';
      }
      if (rules.phone && !isValidPhone(value)) {
        errors[field] = 'Please enter a valid phone number';
      }
      if (rules.name && !isValidName(value)) {
        errors[field] = 'Name must be at least 2 characters';
      }
      if (rules.minLength && value.length < rules.minLength) {
        errors[field] = `${field} must be at least ${rules.minLength} characters`;
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        errors[field] = `${field} must be less than ${rules.maxLength} characters`;
      }
      if (rules.custom) {
        const customError = rules.custom(value, formData);
        if (customError) {
          errors[field] = customError;
        }
      }
    }
  });
  
  return errors;
};

// Common validation rules
export const validationRules = {
  email: {
    required: true,
    email: true,
  },
  password: {
    required: true,
    password: true,
  },
  confirmPassword: {
    required: true,
    custom: (value, formData) => {
      if (value !== formData.password) {
        return 'Passwords do not match';
      }
      return null;
    },
  },
  firstName: {
    required: true,
    name: true,
  },
  lastName: {
    required: true,
    name: true,
  },
  phone: {
    required: true,
    phone: true,
  },
};
