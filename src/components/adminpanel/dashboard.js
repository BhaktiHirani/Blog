import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, doc, getDocs, updateDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase'; // Adjust the path to your Firebase configuration file
import './dashboard.css';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const [setSelectedPost] = useState(null);
  const [userDetails, setUserDetails] = useState(null); // Store user details when clicked
  const navigate = useNavigate(); // Initialize this at the start of your component

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const blogsCollection = collection(db, 'blogs');

      try {
        // Fetch all users first
        const userDocs = await getDocs(usersCollection);
        console.log('User Documents:', userDocs.docs.map(doc => doc.data()));

        // Fetch all blogs after users are fetched
        const blogDocs = await getDocs(blogsCollection);
        console.log('Blog Documents:', blogDocs.docs.map(doc => doc.data()));

        const usersData = userDocs.docs.map((userDoc) => {
          const userId = userDoc.id; // User's unique ID from the users collection
          const userData = userDoc.data();

          // Filter blogs for this specific user
          const userBlogs = blogDocs.docs.filter((blogDoc) => {
            const blogData = blogDoc.data();
            console.log('Checking blog authorId:', blogData.authorId, 'against userId:', userId);
            return blogData.authorId === userId; // Ensure authorId matches userId
          });

          console.log(`User ${userId} has ${userBlogs.length} blog(s)`);

          return {
            id: userId,
            ...userData, // User data (email, fullName, etc.)
            blogs: userBlogs.map((blogDoc) => ({
              id: blogDoc.id,
              ...blogDoc.data(),
            })), // Map blog data for this user
          };
        });

        console.log('Users with blogs:', usersData);
        setUsers(usersData); // Update the state with the fetched users and blogs
      } catch (error) {
        console.error('Error fetching users and blogs:', error);
      }
    };




    fetchUsers();
  }, []);


  // Fetch user details when a user box is clicked
  const fetchUserDetails = async (userId) => {
    const userRef = doc(db, 'users', userId);
    try {
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserDetails({
          fullName: userData.fullName || 'No Name Provided', // Fallback value
          email: userData.email || 'N/A',
          joinedAt: userData.joinedAt || 'N/A',
          role: userData.role || 'User', // Already fetching role
        });
      } else {
        console.log('No such user!');
      }
    } catch (error) {
      console.error('Error fetching user details: ', error);
    }
  };

  const handleReadMore = (postId) => {
    const post = blogPosts.find((post) => post.id === postId);
    setSelectedPost(post);
    navigate(`/blog/${postId}`);
  };



  // Handle blog approval status update
  const handleStatusUpdate = async (blogId, newStatus) => {
    try {
      const blogDocRef = doc(db, 'blogs', blogId);
      await updateDoc(blogDocRef, { status: newStatus });
      alert(`Blog status updated to: ${newStatus}`);
    } catch (error) {
      console.error('Error updating blog status: ', error);
    }
  };




  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="sidebar bg-dark text-white" style={{ width: '250px', height: '100vh' }}>
        <h3 className="text-center mt-4">Admin Panel</h3>
        <ul className="list-unstyled mt-4">
          <li><Link className="text-white" to="/adminpanel">Dashboard</Link></li>
          <li><Link className="text-white" to="/adminpanel/pendingblogs">Pending Blogs</Link></li>
          <li><Link className="text-white" to="/adminpanel/manageusers">Manage Users</Link></li>
          <li><Link className="text-white" to="/adminpanel/setting">Settings</Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="content w-100">
        <header className="bg-primary text-white p-3">
          <h2>Admin Dashboard</h2>
        </header>

        <div className="container mt-4">
          <h4>User Blogs Management</h4>
          <div className="d-flex flex-wrap  justify-content-between">
            {/* User Box */}
            {users.map((user) => (
              <div
                key={user.id}
                className="user-box p-4 m-2 border rounded shadow-sm bg-light"
                style={{ cursor: 'pointer', width: '300px' }}
                onClick={() => {
                  setSelectedUser(user);
                  fetchUserDetails(user.id); // Fetch user details on click
                }}
              >
                <div> <h5 className="text-primary">{user.email}</h5>  <p className="milestone-tag">{user.role || 'No Role Assigned'}</p>
                </div>
                <p style={{ color: "gray" }}> {user.fullname}</p>
                <p className="text-muted">{user.blogs.length} blog(s) available</p>

              </div>
            ))}
          </div>

          {/* Selected User Details */}
          {selectedUser && (
            <div className="user-details mt-4 p-4 border rounded bg-white shadow-sm">
              <h5 className="text-primary">Details for {selectedUser.email}</h5>
              {userDetails && (
                <div>
                  <p><strong>Name:</strong> {userDetails.fullname}</p>
                  <p><strong>Email:</strong> {userDetails.email}</p>
                  <p><strong>Role:</strong> {userDetails.role}</p>
                  {blogPosts.length === 0 ? (
          <p>No blog posts available.</p>
        ) : (
          blogPosts.map(post => (
            <div key={post.id} className="blog-item">
              <h3>{post.title}</h3>
             
            </div>
          ))
        )}
                  {/* Add other user details you want to display */}
                </div>
              )}
              {selectedUser && selectedUser.blogPosts && selectedUser.blogPosts.length === 0 ? (
                <p>No blog posts available.</p>
              ) : (
                selectedUser.blogPosts?.map((post) => (
                  <div key={post.id} className="blog-item p-3 m-2 border rounded shadow-sm bg-light">
                    <h3 className="text-primary">{post.title}</h3>
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleStatusUpdate(post.id, 'Approved')}
                      >
                        Enable
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleStatusUpdate(post.id, 'Not Approved')}
                      >
                        Disable
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleReadMore(post.id)}
                      >
                        {post.title ? `Read More: ${post.title}` : 'Read More'}
                      </button>
                    </div>
                  </div>
                ))
              )}



            </div>
          )}

        </div>
      </div>


    </div>
  );
};

export default Dashboard;
