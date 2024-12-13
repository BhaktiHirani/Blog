import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';  // Adjust the path to your Firebase configuration file
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Login/forget.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
  
    if (!email) {
      setError('Email is required');
      return;
    }
  
    try {
      setLoading(true); // Show loading indicator
      setError('');
      setMessage('');
  
      // Send password reset email via Firebase
      await sendPasswordResetEmail(auth, email);
  
      setMessage('Password reset email sent! Please check your inbox.');
    } catch (error) {
      console.error('Error sending password reset email: ', error);
      if (error.code === 'auth/user-not-found') {
        setError('No user found with this email.');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };
  
  return (
    <div className="forgot-password-page">
      <div className="container forgot-password-container">
        <div className="row align-items-center">
          <div className="col-md-6 illustration">
            <img
              src="https://png.pngtree.com/png-vector/20191027/ourmid/pngtree-blogger-review-concept-vetor-popular-young-video-streamer-blogger-girl-woman-png-image_1893986.jpg"
              alt="Illustration"
              className="img-fluid"
            />
          </div>
          <div className="col-md-6 forgot-password-form">
            <h2 className="text-center mb-4">Forgot Your Password?</h2>
            <form onSubmit={handleForgotPassword}>
              {error && <div className="alert alert-danger">{error}</div>}
              {message && <div className="alert alert-success">{message}</div>}
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                      <i className="ri-mail-line"></i>
                    </div>
                  </div>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-block mt-3" disabled={loading}>
                {loading ? 'Sending reset email...' : 'Send Reset Email'}
              </button>
            </form>
            <div className="text-center mt-4">
              <p>Remembered your password? <a href="/login" className="login-link">Login here</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
