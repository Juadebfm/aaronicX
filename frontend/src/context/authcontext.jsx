import React, { createContext, useState, useContext, useCallback } from "react";

// Password strength validation function
const validatePasswordStrength = (password) => {
  const strengths = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /[0-9]/.test(password),
    specialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const strengthScore = Object.values(strengths).filter(Boolean).length;
  let strengthLabel = "Very Weak";

  if (strengthScore === 5) strengthLabel = "Very Strong";
  else if (strengthScore === 4) strengthLabel = "Strong";
  else if (strengthScore === 3) strengthLabel = "Medium";
  else if (strengthScore === 2) strengthLabel = "Weak";

  return {
    isValid: strengthScore >= 3,
    score: strengthScore,
    label: strengthLabel,
    details: strengths,
  };
};

// Create the AuthContext
const AuthContext = createContext({
  formState: {},
  updateFormField: () => {},
  isFormValid: () => false,
  resetForm: () => {},
  validatePassword: () => ({
    isValid: false,
    score: 0,
    label: "Very Weak",
    details: {
      length: false,
      uppercase: false,
      lowercase: false,
      numbers: false,
      specialChars: false,
    },
  }),
});

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [formState, setFormState] = useState({});

  // Update a specific form field
  const updateFormField = useCallback((formName, fieldName, value) => {
    setFormState((prevState) => ({
      ...prevState,
      [formName]: {
        ...prevState[formName],
        [fieldName]: value,
      },
    }));
  }, []);

  // Check if a specific form is completely filled
  const isFormValid = useCallback(
    (formName, requiredFields) => {
      const currentForm = formState[formName] || {};
      return requiredFields.every((field) => {
        // Special handling for password
        if (field === "password") {
          return (
            currentForm[field] &&
            validatePasswordStrength(currentForm[field]).isValid
          );
        }
        return currentForm[field] && currentForm[field].trim() !== "";
      });
    },
    [formState]
  );

  // Reset a specific form
  const resetForm = useCallback((formName) => {
    setFormState((prevState) => ({
      ...prevState,
      [formName]: {},
    }));
  }, []);

  // Password validation method
  const validatePassword = useCallback((password) => {
    return validatePasswordStrength(password);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        formState,
        updateFormField,
        isFormValid,
        resetForm,
        validatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
