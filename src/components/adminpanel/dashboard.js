import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Your Firestore initialization

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, "users");
      try {
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

            return {
              id: userId,
              ...userData,
              blogs: userBlogs,
            };
          })
        );

        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users and blogs:", error);
      }
    };

    fetchUsers();
  }, []);

  const fetchUserDetails = async (userId) => {
    const userRef = doc(db, "users", userId);
    try {
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserDetails({
          fullName: userData.fullName || "No Name Provided",
          email: userData.email || "N/A",
          role: userData.role || "User",
        });
      }
    } catch (error) {
      console.error("Error fetching user details: ", error);
    }
  };

  const closePopup = () => {
    setSelectedUser(null);
    setUserDetails(null);
  };

  return (
    <div className="dashboard d-flex">
      {/* Sidebar */}
      <div
        className="sidebar bg-dark text-white position-fixed"
        style={{ width: "250px", height: "100vh", flexShrink: 0 }}
      >
        <h3 className="text-center mt-4">Admin Panel</h3>
        <ul className="list-unstyled mt-4">
          <li>
            <Link className="text-white" to="/adminpanel">
              Dashboard
            </Link>
          </li>
          <li>
            <Link className="text-white" to="/adminpanel/pendingblogs">
              Pending Blogs
            </Link>
          </li>
          <li>
            <Link className="text-white" to="/adminpanel/manageusers">
              Manage Users
            </Link>
          </li>
          <li>
            <Link className="text-white" to="/adminpanel/setting">
              Settings
            </Link>
          </li>
        </ul>
      </div>

      {/* User list */}
      <div className="user-list d-flex flex-wrap gap-4 p-5" style={{ flex: 1, marginLeft: "250px" }}>
        {users.map((user) => (
          <div
            key={user.id}
            className="card user-box shadow"
            style={{ width: "18rem", cursor: "pointer" }}
            onClick={() => {
              setSelectedUser(user);
              fetchUserDetails(user.id);
            }}
          >
            <div className="card-body">
              <h5 className="card-title">{user.fullname || "No Name"}</h5>
              <h6 className="card-subtitle mb-2 text-muted">{user.email}</h6>
              <p className="card-text">{user.blogs.length} blog(s)</p>
            </div>
          </div>
        ))}
      </div>

      {/* Popup for Details */}
      {selectedUser && (
        <div
          className="popup position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1050,
          }}
        >
          <div
            className="popup-content bg-white p-4 rounded position-relative"
            style={{ width: "500px", maxHeight: "90vh", overflowY: "auto" }}
          >
            <button
              className="btn-close position-absolute"
              style={{ top: "10px", right: "10px" }}
              onClick={closePopup}
            ></button>
            <h3>Details for {selectedUser.fullName}</h3>
            <div>
              <p>Email: {userDetails?.email}</p>
              <p>Role: {userDetails?.role}</p>
            </div>
            {selectedUser.blogs.length > 0 ? (
              <ul>
                {selectedUser.blogs.map((blog) => (
                  <li key={blog.id}>
                    <h4>{blog.title || "No Title Available"}</h4>
                    <p>{blog.content || "No Content Available"}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No blogs found for this user.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
