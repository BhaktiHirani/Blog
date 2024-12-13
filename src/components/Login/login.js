import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase'; // Adjust the path to your Firebase configuration file
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
  
    try {
      setLoading(true); // Show loading indicator
  
      // Check for hardcoded admin credentials first
      if (email === "admin@gmail.com" && password === "Admin@123") {
        console.log('Redirecting to Admin Dashboard');
        navigate('/dashboard'); // Redirect to Admin Dashboard
        return;
      }
  
      // For other users, use Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      if (user) {
        console.log('Login successful!');
  
        // Fetch user role from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
  
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userRole = userData.role;
  
          if (userRole === 'User') {
            console.log('Redirecting to User Dashboard');
            navigate('/'); // Redirect to User Dashboard
          } else {
            setError('Role not assigned. Please contact support.');
          }
        } else {
          setError('User data not found in Firestore. Please contact support.');
        }
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
    } finally {
      setLoading(false); // Stop loading indicator
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
                    <i className="ri-lock-line"></i>
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
              <div className="reminder d-flex justify-content-between align-items-center">
                <a href="/forgot-password" className="forgot-password-link">Forgot Password?</a>
              </div>
              <button type="submit" className="btn btn-primary btn-block mt-3" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
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
