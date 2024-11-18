import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';  // Correct path to the firebase.js file
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user) {
        console.log('Login successful!');
        navigate('/home');  // Redirect to home after successful login
      }
    } catch (error) {
      console.error('Error logging in: ', error);
      if (error.code === 'auth/user-not-found') {
        setError('No user found with this email.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="login-page">
      <div className="container login-container">
        <div className="row align-items-center">
          <div className="col-md-6 text-center">
            <img
              src="https://png.pngtree.com/png-vector/20191027/ourmid/pngtree-blogger-review-concept-vetor-popular-young-video-streamer-blogger-girl-woman-png-image_1893986.jpg"
              alt="Illustration"
              className="img-fluid"
            />
          </div>
          <div className="col-md-6 login-form">
            <h2 className="text-center mb-4">Login to Your Blog</h2>
            <form onSubmit={handleLogin}>
              {error && <div className="alert alert-danger">{error}</div>}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group d-flex justify-content-between align-items-center">
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="rememberMe" />
                  <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                </div>
                <a href="/forgot-password" className="forgot-password-link">Forgot Password?</a>
              </div>
              <button type="submit" className="btn btn-primary btn-block mt-3">Login</button>
            </form>
            <div className="text-center mt-4">
              <p>Don’t have an account? <Link to="/signup" className="signup-link">Sign up here</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
