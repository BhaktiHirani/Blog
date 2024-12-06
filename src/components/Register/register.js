import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { setDoc, doc, getDocs, query, collection, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./register.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    role: "User",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const navigate = useNavigate();

  // Validate the form fields
  const validate = () => {
    let validationErrors = {};
    const nameParts = formData.fullName.trim().split(" ");

    // Full Name validation
    if (!formData.fullName.trim()) {
      validationErrors.fullName = "Full name is required";
    } else if (nameParts.length < 3) {
      validationErrors.fullName =
        "Full name must include first, middle, and last name";
    }

    // Email validation
    if (!formData.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = "Email address is invalid";
    }

    // Password validation
    const passwordCriteria = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!formData.password.trim()) {
      validationErrors.password = "Password is required";
    } else if (!passwordCriteria.test(formData.password)) {
      validationErrors.password =
        "Password must include at least 8 characters, an uppercase letter, a number, and a special character.";
    }

    // Confirm Password validation
    if (!formData.confirmPassword.trim()) {
      validationErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.confirmPassword !== formData.password) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    // Terms & Conditions validation
    if (!formData.agreeToTerms) {
      validationErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(validationErrors);
    return validationErrors;
  };

  // Input change handler
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    // If validation fails, prevent form submission
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      // Check if email is already in use
      const userQuery = await getDocs(
        query(collection(db, "users"), where("email", "==", formData.email))
      );
      if (!userQuery.empty) {
        alert("Email is already in use. Please use a different email.");
        return;
      }

      // Register user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Update user profile
      await updateProfile(user, { displayName: formData.fullName });

      // Save user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        fullName: formData.fullName,
        role: formData.role,
        createdAt: new Date(),
      });

      // Display success message
      setSuccessMessage("Registration successful! Redirecting to login page...");
      setTimeout(() => {
        navigate("/login"); // Redirect to login after 3 seconds
      }, 3000);
    } catch (error) {
      console.error("Error during registration:", error);
      alert(error.message); // Display Firebase error message
    }
  };

  return (
    <div className="login-page">
      <div className="container login-container">
        <div className="row align-items-center">
          <div className="col-md-6 text-center">
            <div className="illustration">
              <img
                src="https://png.pngtree.com/png-vector/20191027/ourmid/pngtree-blogger-review-concept-vetor-popular-young-video-streamer-blogger-girl-woman-png-image_1893986.jpg"
                alt="Illustration"
                className="img-fluid"
              />
            </div>
          </div>

          <div className="col-md-6 login-form">
            <h2 className="text-center mb-4">Register to Your Blog</h2>
            {successMessage && (
              <div className="alert alert-success" role="alert">
                {successMessage}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              {/* Full Name Input */}
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="fullName"
                  placeholder="Enter Your Full Name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                />
                {errors.fullName && (
                  <small className="text-danger">{errors.fullName}</small>
                )}
              </div>

              {/* Email Input */}
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
                {errors.email && (
                  <small className="text-danger">{errors.email}</small>
                )}
              </div>

              {/* Password Input */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                />
                {errors.password && (
                  <small className="text-danger">{errors.password}</small>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                />
                {errors.confirmPassword && (
                  <small className="text-danger">{errors.confirmPassword}</small>
                )}
              </div>

              {/* Role Selection */}
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  className="form-control"
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              {/* Terms & Conditions */}
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={(e) =>
                    handleInputChange("agreeToTerms", e.target.checked)
                  }
                />
                <label
                  className="form-check-label"
                  htmlFor="agreeToTerms"
                >
                  I agree to the Terms and Conditions
                </label>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-primary btn-block mt-3">
                Register
              </button>
            </form>

            {/* Redirect to Login */}
            <div className="text-center mt-4">
              <p>
                Already have an account?{" "}
                <a href="/login" className="signup-link">
                  Sign in here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
