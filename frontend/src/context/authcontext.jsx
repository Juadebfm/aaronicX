import React, { createContext, useState, useContext, useCallback } from "react";

// Create the AuthContext
const AuthContext = createContext({
  formState: {},
  updateFormField: () => {},
  isFormValid: () => false,
  resetForm: () => {},
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
      return requiredFields.every(
        (field) => currentForm[field] && currentForm[field].trim() !== ""
      );
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

  return (
    <AuthContext.Provider
      value={{
        formState,
        updateFormField,
        isFormValid,
        resetForm,
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
