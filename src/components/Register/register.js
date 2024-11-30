import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase"; // Combined import for auth and db
import { setDoc, doc,getDocs, query, collection, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './register.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    role: 'User', // Default role set to 'User'
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validation function
  const validate = () => {
    let errors = {};
    const nameParts = formData.fullName.trim().split(' ');

    // Full Name validation
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (nameParts.length < 3) {
      errors.fullName = 'Full name must include first, middle, and last name';
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email address is invalid';
    }

    // Password validation
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    // Confirm Password validation
    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = 'Confirm Password is required';
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Terms and Conditions validation
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
    }

const handleSignUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Now, add user data to Firestore under 'users' collection
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      uid: user.uid,
      createdAt: new Date(),
      // Add any other user details you want to store here
    });

    console.log('User created and data stored in Firestore');
  } catch (error) {
    console.error('Error signing up:', error);
  }
};


    return errors;
  };

  // Input change handler
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
  
    // Check if there are validation errors
    if (Object.keys(validationErrors).length > 0) {
      alert('Please fix the errors before submitting.');
      return;
    }
  
    try {
      // Check if email is already in use
      const userQuery = await getDocs(query(collection(db, "users"), where("email", "==", formData.email)));
      if (!userQuery.empty) {
        alert("Email is already in use. Please use a different email.");
        return;
      }

       // Navigate based on role
    if (formData.role === 'admin') {
      navigate('/dashboard'); // Admin panel route
    } else {
      navigate('/user-dashboard'); // User dashboard route (optional)
    }

  
      // Register user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
  
      if (user) {
        // Store additional user data in Firestore
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          fullname: formData.fullName,
          role: formData.role, // Store the selected role in Firestore
        });
        console.log("User registered successfully");
        navigate('/login'); // Redirect to login page after successful registration
      }
    } catch (error) {
      // Error handling for Firebase authentication
      if (error.code === 'auth/email-already-in-use') {
        alert('Email is already in use. Please use a different email.');
      } else {
        alert(error.message); // Show generic error message
      }
      console.log(error.message); // Log detailed error message for debugging
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
            <form onSubmit={handleSubmit}>
              {/* Full Name Input */}
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="fullName"
                  placeholder="Enter Your Fullname (First Middle Last)"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  required
                />
                {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
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
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
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
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
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
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                />
                {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
              </div>

              {/* Role Selection */}
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  className="form-control"
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              {/* Terms & Conditions Checkbox */}
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                  required
                />
                <label className="form-check-label" htmlFor="agreeToTerms">I agree to the Terms and Conditions</label>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-primary btn-block mt-3">Register</button>
            </form>

            {/* Redirect to Login page */}
            <div className="text-center mt-4">
              <p>Already have an account? <a href="/login" className="signup-link">Sign in here</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
