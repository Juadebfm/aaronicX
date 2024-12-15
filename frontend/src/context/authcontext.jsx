import React, { createContext, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Password strength validation function (unchanged)
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
  signup: async () => {},
  login: async () => {},
  authError: null,
});

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [formState, setFormState] = useState({ signup: {} });

  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

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

  // Signup API call
  const signup = async () => {
    const signupData = formState.signup;

    if (!signupData) {
      setAuthError("Please fill out all signup fields");
      return false;
    }

    try {
      const response = await fetch("http://localhost:3001/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${signupData.firstname} ${signupData.lastname}`,
          email: signupData.email,
          password: signupData.password,
          age: signupData.age || 0,
          NIN: signupData.nin || "",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Signup API response:", response.status, result);

        // Clear any previous errors
        setAuthError(null);
        // Navigate to login page
        navigate("/");
        return true;
      } else {
        // Handle error response
        setAuthError(result.message || "Signup failed");
        return false;
      }
    } catch (error) {
      console.error("Signup error:", error);
      setAuthError("Network error. Please try again.");
      return false;
    }
  };

  // Login API call
  const login = async () => {
    const loginData = formState.login;

    if (!loginData) {
      setAuthError("Please fill out all login fields");
      return false;
    }

    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.username || loginData.email,
          password: loginData.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Store token in localStorage or sessionStorage
        localStorage.setItem("userToken", result.token);
        // Clear any previous errors
        setAuthError(null);
        // Navigate to dashboard
        navigate("/dashboard");
        return true;
      } else {
        // Handle error response
        setAuthError(result.message || "Login failed");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuthError("Network error. Please try again.");
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        formState,
        updateFormField,
        isFormValid,
        resetForm,
        validatePassword,
        signup,
        login,
        authError,
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
