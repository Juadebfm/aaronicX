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
  logout: () => {},
  isAuthenticated: () => false,
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

  // Logout functionality
  const logout = useCallback(() => {
    // Clear local storage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");

    // Navigate to login page
    navigate("/");
  }, [navigate]);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return !!localStorage.getItem("accessToken");
  }, []);

  // Signup API call
  const signup = async () => {
    const signupData = formState.signup;

    if (!signupData) {
      setAuthError("Please fill out all signup fields");
      return false;
    }

    try {
      const response = await fetch(
        "https://payment-gray-phi.vercel.app/api/auth/signup",
        {
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
        }
      );

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

  // Modify login method to store user data
  const login = async () => {
    const loginData = formState.login;

    if (!loginData) {
      setAuthError("Please fill out all login fields");
      return false;
    }

    try {
      // Get user location
      let location = "Unknown";
      try {
        const locationData = await fetch("https://ipapi.co/json/");
        const locationInfo = await locationData.json();
        location = `${locationInfo.city || ""}, ${
          locationInfo.country_name || ""
        }`.trim();
      } catch (error) {
        console.error("Location fetch error:", error);
      }

      const response = await fetch(
        "https://payment-gray-phi.vercel.app/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: loginData.username || loginData.email,
            password: loginData.password,
            location, // This will be used by trackLogin middleware
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        localStorage.setItem("accessToken", result.tokens.accessToken);
        localStorage.setItem("refreshToken", result.tokens.refreshToken);
        localStorage.setItem("userData", JSON.stringify(result.user));

        setAuthError(null);
        navigate("/dashboard");
        return true;
      } else {
        setAuthError(result.message || "Login failed");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuthError("Network error. Please try again.");
      return false;
    }
  };

  const getUserData = () => {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
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
        logout,
        authError,
        isAuthenticated,
        getUserData,
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

// Create a ProtectedRoute component
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated() ? children : null;
};
