/**
 * Form Validation Utilities
 * Provides functions for validating forms across the application
 */

// Email validation pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone number validation pattern (10-15 digits)
const PHONE_REGEX = /^[6-9]\d{9}$/; // Indian phone numbers

// Password strength validation
const PASSWORD_REGEX = {
  hasUpperCase: /[A-Z]/,
  hasLowerCase: /[a-z]/,
  hasNumbers: /\d/,
  hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
  minLength: 8,
};

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {object} - {isValid: boolean, error: string}
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email is required' };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }
  return { isValid: true, error: null };
};

/**
 * Validates phone number format
 * @param {string} phone - Phone number to validate
 * @returns {object} - {isValid: boolean, error: string}
 */
export const validatePhone = (phone) => {
  if (!phone || phone.trim() === '') {
    return { isValid: false, error: 'Phone number is required' };
  }
  // Remove any non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  if (!PHONE_REGEX.test(cleanPhone)) {
    return {
      isValid: false,
      error: 'Invalid phone number (must be 10-15 digits)',
    };
  }
  return { isValid: true, error: null };
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {object} - {isValid: boolean, error: string, strength: string}
 */
export const validatePassword = (password) => {
  if (!password || password.trim() === '') {
    return { isValid: false, error: 'Password is required', strength: 'none' };
  }

  if (password.length < PASSWORD_REGEX.minLength) {
    return {
      isValid: false,
      error: `Password must be at least ${PASSWORD_REGEX.minLength} characters`,
      strength: 'weak',
    };
  }

  let strength = 0;
  if (PASSWORD_REGEX.hasUpperCase.test(password)) strength++;
  if (PASSWORD_REGEX.hasLowerCase.test(password)) strength++;
  if (PASSWORD_REGEX.hasNumbers.test(password)) strength++;
  if (PASSWORD_REGEX.hasSpecialChar.test(password)) strength++;

  const strengthMap = {
    1: 'weak',
    2: 'fair',
    3: 'good',
    4: 'strong',
  };

  const passwordStrength = strengthMap[strength] || 'weak';

  if (strength < 3) {
    return {
      isValid: false,
      error:
        'Password must include uppercase, lowercase, numbers, and special characters',
      strength: passwordStrength,
    };
  }

  return {
    isValid: true,
    error: null,
    strength: passwordStrength,
  };
};

/**
 * Validates required field
 * @param {string} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @returns {object} - {isValid: boolean, error: string}
 */
export const validateRequired = (value, fieldName = 'Field') => {
  if (value === null || value === undefined || value.toString().trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true, error: null };
};

/**
 * Validates numeric field
 * @param {string|number} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @returns {object} - {isValid: boolean, error: string}
 */
export const validateNumeric = (value, fieldName = 'Field') => {
  if (isNaN(value) || value === '') {
    return {
      isValid: false,
      error: `${fieldName} must be a valid number`,
    };
  }
  return { isValid: true, error: null };
};

/**
 * Validates minimum length
 * @param {string} value - Value to validate
 * @param {number} minLength - Minimum length required
 * @param {string} fieldName - Field name for error message
 * @returns {object} - {isValid: boolean, error: string}
 */
export const validateMinLength = (value, minLength, fieldName = 'Field') => {
  if (!value || value.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minLength} characters`,
    };
  }
  return { isValid: true, error: null };
};

/**
 * Validates maximum length
 * @param {string} value - Value to validate
 * @param {number} maxLength - Maximum length allowed
 * @param {string} fieldName - Field name for error message
 * @returns {object} - {isValid: boolean, error: string}
 */
export const validateMaxLength = (value, maxLength, fieldName = 'Field') => {
  if (value && value.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} cannot exceed ${maxLength} characters`,
    };
  }
  return { isValid: true, error: null };
};

/**
 * Validates name format
 * @param {string} name - Name to validate
 * @returns {object} - {isValid: boolean, error: string}
 */
export const validateName = (name) => {
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  if (!name || name.trim() === '') {
    return { isValid: false, error: 'Name is required' };
  }
  if (!nameRegex.test(name)) {
    return {
      isValid: false,
      error: 'Name must contain only letters and spaces (2-50 characters)',
    };
  }
  return { isValid: true, error: null };
};

/**
 * Validates if two passwords match
 * @param {string} password - First password
 * @param {string} confirmPassword - Confirmation password
 * @returns {object} - {isValid: boolean, error: string}
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'Passwords do not match',
    };
  }
  return { isValid: true, error: null };
};

/**
 * Validates salary
 * @param {string|number} salary - Salary value
 * @returns {object} - {isValid: boolean, error: string}
 */
export const validateSalary = (salary) => {
  const salaryNum = parseFloat(salary);
  if (isNaN(salaryNum) || salaryNum <= 0) {
    return {
      isValid: false,
      error: 'Salary must be a positive number',
    };
  }
  if (salaryNum > 10000000) {
    return {
      isValid: false,
      error: 'Salary cannot exceed 10,000,000',
    };
  }
  return { isValid: true, error: null };
};

/**
 * Validates date format and that it's not in the future
 * @param {string} dateString - Date string (YYYY-MM-DD format)
 * @param {boolean} allowFuture - Allow future dates
 * @returns {object} - {isValid: boolean, error: string}
 */
export const validateDate = (dateString, allowFuture = false) => {
  if (!dateString) {
    return { isValid: false, error: 'Date is required' };
  }

  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Invalid date format' };
  }

  if (!allowFuture && date > today) {
    return {
      isValid: false,
      error: 'Date cannot be in the future',
    };
  }

  return { isValid: true, error: null };
};

/**
 * Batch validation - validates multiple fields at once
 * @param {object} fields - Object with field names as keys and values to validate
 * @param {object} rules - Object with field names as keys and validation rules as values
 * @returns {object} - {isValid: boolean, errors: {fieldName: error}}
 */
export const validateBatch = (fields, rules) => {
  const errors = {};
  let isValid = true;

  Object.keys(rules).forEach((fieldName) => {
    const rule = rules[fieldName];
    const value = fields[fieldName];

    if (rule.type === 'required') {
      const result = validateRequired(value, rule.label || fieldName);
      if (!result.isValid) {
        errors[fieldName] = result.error;
        isValid = false;
      }
    }

    if (rule.type === 'email') {
      const result = validateEmail(value);
      if (!result.isValid) {
        errors[fieldName] = result.error;
        isValid = false;
      }
    }

    if (rule.type === 'phone') {
      const result = validatePhone(value);
      if (!result.isValid) {
        errors[fieldName] = result.error;
        isValid = false;
      }
    }

    if (rule.type === 'password') {
      const result = validatePassword(value);
      if (!result.isValid) {
        errors[fieldName] = result.error;
        isValid = false;
      }
    }

    if (rule.minLength) {
      const result = validateMinLength(
        value,
        rule.minLength,
        rule.label || fieldName
      );
      if (!result.isValid) {
        errors[fieldName] = result.error;
        isValid = false;
      }
    }

    if (rule.maxLength) {
      const result = validateMaxLength(
        value,
        rule.maxLength,
        rule.label || fieldName
      );
      if (!result.isValid) {
        errors[fieldName] = result.error;
        isValid = false;
      }
    }
  });

  return { isValid, errors };
};

export default {
  validateEmail,
  validatePhone,
  validatePassword,
  validateRequired,
  validateNumeric,
  validateMinLength,
  validateMaxLength,
  validateName,
  validatePasswordMatch,
  validateSalary,
  validateDate,
  validateBatch,
};
