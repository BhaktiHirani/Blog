import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase"; // Your Firestore initialization

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  // Fetching all users and their blogs
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const userDocs = await getDocs(usersCollection);
        const usersData = await Promise.all(
          userDocs.docs.map(async (userDoc) => {
            const userId = userDoc.id;
            const userData = userDoc.data();
            const blogPostsCollection = collection(
              db,
              "users",
              userId,
              "blogPosts"
            );
            const blogDocs = await getDocs(blogPostsCollection);

            const userBlogs = blogDocs.docs.map((blogDoc) => ({
              id: blogDoc.id,
              ...blogDoc.data(),
            }));

            return { id: userId, ...userData, blogs: userBlogs };
          })
        );
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Fetching user details
  const fetchUserDetails = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setUserDetails(userDoc.data());
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // Handle blog deletion
  const handleDeleteBlog = async (userId, blogId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "users", userId, "blogPosts", blogId));
      setSelectedUser((prevUser) => ({
        ...prevUser,
        blogs: prevUser.blogs.filter((blog) => blog.id !== blogId),
      }));
      alert("Blog deleted successfully!");
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete the blog. Please try again.");
    }
  };

  // Handle blog approval
  const handleApproveBlog = async (userId, blogId, currentStatus) => {
    if (currentStatus === "Approved") {
      alert("This blog is already approved.");
      return;
    }

    try {
      const blogRef = doc(db, "users", userId, "blogPosts", blogId);
      await updateDoc(blogRef, { status: "Approved" });

      setSelectedUser((prevUser) => ({
        ...prevUser,
        blogs: prevUser.blogs.map((blog) =>
          blog.id === blogId ? { ...blog, status: "Approved" } : blog
        ),
      }));

      alert("Blog approved successfully!");
    } catch (error) {
      console.error("Error approving blog:", error);
      alert("Failed to approve the blog. Please try again.");
    }
  };

  // Close popup
  const closePopup = () => {
    setSelectedUser(null);
    setUserDetails(null);
  };

  return (
    <div className="dashboard d-flex">
      {/* Sidebar */}
      <div className="sidebar">
        <h3>Admin Panel</h3>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/adminpanel">Dashboard</Link>
          </li>
          <li>
            <Link to="/adminpanel/pendingblogs">Pending Blogs</Link>
          </li>
          <li>
            <Link to="/adminpanel/manageusers">Manage Users</Link>
          </li>
          <li>
            <Link to="/adminpanel/setting">Settings</Link>
          </li>
        </ul>
      </div>

      {/* User list */}
      <div className="user-list">
        {users.map((user) => (
          <div
            key={user.id}
            className="user-box"
            onClick={() => {
              setSelectedUser(user);
              fetchUserDetails(user.id);
            }}
          >
            <h5>{user.fullname || "No Name"}</h5>
            <p>{user.blogs.length} blogs</p>
          </div>
        ))}
      </div>

      {/* User Details Popup */}
      {selectedUser && (
        <div className="popup">
          <div className="popup-content">
            <button className="btn-close" onClick={closePopup}></button>
            <h3>Details for {selectedUser.fullname || "No Name"}</h3>
            <p>
              <b>Email:</b> {userDetails?.email || "N/A"}
            </p>
            <p>
              <b>Role:</b> {userDetails?.role || "User"}
            </p>
            {selectedUser.blogs.length > 0 ? (
              <ul>
                {selectedUser.blogs.map((blog) => (
                  <li key={blog.id}>
                    <h4>{blog.title || "No Title"}</h4>
                    <p>{blog.content || "No Content"}</p>
                    <button
                      onClick={() =>
                        handleDeleteBlog(selectedUser.id, blog.id)
                      }
                    >
                      Delete
                    </button>
                    <button
                      onClick={() =>
                        handleApproveBlog(selectedUser.id, blog.id, blog.status)
                      }
                    >
                      Approve
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No blogs available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
