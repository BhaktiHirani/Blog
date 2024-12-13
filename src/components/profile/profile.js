import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ProfilePage = () => {
  const [userDetails, setUserDetails] = useState({
    fullName: '',
    email: '',
    avatar: null,
  });
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserDetails(prevState => ({
        ...prevState,
        email: user.email,
      }));
      fetchUserDetails(user.uid);
    } else {
      navigate('/login');
    }
  }, [auth, navigate]);

  const fetchUserDetails = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Set user details (fullName, email, avatar)
        setUserDetails({
          fullName: userData.fullName || "No Name Provided",
          email: userData.email || "N/A",
          avatar: userData.avatar || null,
        });
      } else {
        console.error("User document does not exist.");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const getInitials = (email) => {
    // Extract the first letter of the email before the '@' symbol
    const firstLetter = email.charAt(0).toUpperCase();
    return firstLetter;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.profileCard}>
        <h2 style={styles.profileHeading}>Profile</h2>
        <div style={styles.avatarContainer}>
          {userDetails.avatar ? (
            <img src={userDetails.avatar} alt="Profile Avatar" style={styles.avatarImg} />
          ) : (
            <div style={styles.defaultAvatar}>
              <span style={styles.avatarPlaceholder}>{getInitials(userDetails.email)}</span>
            </div>
          )}
        </div>

        <div style={styles.userInfo}>
          <p><strong>Full Name:</strong> {userDetails.fullName}</p>
          <p><strong>Email:</strong> {userDetails.email}</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>

      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
    padding: '10px',
  },
  profileCard: {
    width: '100%',
    maxWidth: '400px',
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    position: 'relative',
  },
  avatarContainer: {
    position: 'relative',
    width: '120px',
    height: '120px',
    margin: '0 auto',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '3px solid #ddd',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  defaultAvatar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    fontSize: '36px',
    color: '#bbb',
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    fontSize: '36px',
    color: '#bbb',
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginTop: '10px',
  },
  iconButton: {
    backgroundColor: '#fff',
    border: 'none',
    borderRadius: '50%',
    padding: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    cursor: 'pointer',
    transition: 'background-color 0.2s, color 0.2s',
  },
  icon: {
    color: '#555',
    fontSize: '16px',
  },
  profileHeading: {
    marginBottom: '20px',
    fontSize: '24px',
    color: '#333',
    fontWeight: 'bold',
  },
  userInfo: {
    margin: '20px 0',
    fontSize: '16px',
    color: '#555',
    textAlign: 'left',
  },
  logoutButton: {
    marginTop: '20px',
    width: '100%',
    fontSize: '16px',
    padding: '10px',
    backgroundColor: 'teal',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  logoutButtonHover: {
    backgroundColor: '#c82333',
  },
};

export default ProfilePage;
