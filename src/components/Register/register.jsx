// LoginPage.js
import React from 'react';
import { FaLock, FaEnvelope } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './register.css'; // Custom CSS for styling

const RegisterPage = () => {
  return (
    <div className="login-page">
      <div className="container login-container">
        <div className="row align-items-center">
          {/* Left Column: Illustration */}
          <div className="col-md-6 text-center">
            <div className="illustration">
            <img
              src="https://png.pngtree.com/png-vector/20191027/ourmid/pngtree-blogger-review-concept-vetor-popular-young-video-streamer-blogger-girl-woman-png-image_1893986.jpg"
              alt="Illustration"
              className="img-fluid"
            />
          </div>

          </div>

          {/* Right Column: Login Form */}
          <div className="col-md-6 login-form">
            <h2 className="text-center mb-4">Register to Your Blog</h2>
            <form>
              {/* Email Input */}
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-group">
                <div className="input-group-prepend">
                      <i className="ri-mail-line"></i>
                  </div>

                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <i className='ri-lock-line'></i>
                  </div>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Enter password"
                    required
                  />
                </div>
                
              </div>
              <div className="form-group">
                <label htmlFor="password">Confirm Password</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <i className='ri-lock-line'></i>
                  </div>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Enter password"
                    required
                  />
                </div>
                
              </div>
              

              
              <div className="form-group d-flex justify-content-between align-items-center">
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="rememberMe" />
                  <label className="form-check-label" htmlFor="rememberMe">Terms & Conditions</label>
                </div>
                <a href="/forgot-password" className="forgot-password-link">Forgot Password?</a>
              </div>

              
              <button type="submit" className="btn btn-primary btn-block mt-3">Register</button>
            </form>

          
            <div className="text-center mt-4">
              <p>Don’t have an account? <a href="/" className="signup-link">Sign in here</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
