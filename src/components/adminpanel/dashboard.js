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
import {
FaTrash,FaCheckCircle 
} from 'react-icons/fa';
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
  // const handleDeleteBlog = async (userId, blogId) => {
  //   const confirmDelete = window.confirm(
  //     "Are you sure you want to delete this blog?"
  //   );
  //   if (!confirmDelete) return;
  //   try {
  //     await deleteDoc(doc(db, "users", userId, "blogPosts", blogId));
  //     setSelectedUser((prevUser) => ({
  //       ...prevUser,
  //       blogs: prevUser.blogs.filter((blog) => blog.id !== blogId),
  //     }));
  //     alert("Blog deleted successfully!");
  //   } catch (error) {
  //     console.error("Error deleting blog:", error);
  //     alert("Failed to delete the blog. Please try again.");
  //   }
  // };
  const handleDeleteBlog = async (userId, blogId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (!confirmDelete) return;
  
    try {
      // Delete from user's blogPosts collection
      await deleteDoc(doc(db, "users", userId, "blogPosts", blogId));
  
      // Delete from globalPosts collection
      await deleteDoc(doc(db, "globalPosts", blogId));
  
      // Update state to remove the deleted blog
      setSelectedUser((prevUser) => ({
        ...prevUser,
        blogs: prevUser.blogs.filter((blog) => blog.id !== blogId),
      }));
  
      alert("Blog deleted successfully from both collections!");
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete the blog. Please try again.");
    }
  };
  
  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user and all their blog posts?"
    );
    if (!confirmDelete) return;

    try {
      // Delete user's blog posts
      const blogPostsCollection = collection(db, "users", userId, "blogPosts");
      const blogDocs = await getDocs(blogPostsCollection);

      await Promise.all(blogDocs.docs.map((blog) => deleteDoc(blog.ref)));

      // Delete the user document
      await newFunction();
      // Update state to remove the user from the list
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      setSelectedUser(null);

      alert("User and their blogs deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete the user. Please try again.");
    }

    async function newFunction() {
      await deleteDoc(doc(db, "users", userId));
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
      const globalPostRef = doc(db, "globalPosts", blogId);
      await updateDoc(globalPostRef, { status: "Approved" });

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
      <div
        className="sidebar text-white position-fixed"
        style={{
          width: "250px",
          height: "100vh",
          flexShrink: 0,
          backgroundColor: "#008080",
        }}
      >
        <h3 className="text-center mt-4">Admin Panel</h3>
        <ul className="list-unstyled mt-4">
          <li
            style={{
              marginBottom: "30px",
              fontSize: "1.2rem",
              marginLeft: "45px",
            }}
          >
            <Link
              className="text-white"
              style={{ textDecoration: "none" }}
              to="/"
            >
              Home
            </Link>
          </li>
          <li
            style={{
              marginBottom: "30px",
              fontSize: "1.2rem",
              marginLeft: "45px",
            }}
          >
            <Link
              className="text-white"
              style={{ textDecoration: "none" }}
              to="/dashboard"
            >
              Dashboard
            </Link>
          </li>
      
      
        </ul>
      </div>

      <div
        className="user-list d-flex flex-wrap"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          padding: "20px",
          marginLeft: "250px",
        }}
      >
        {users.map((user) => (
          <div
            key={user.id}
            className="user-box shadow"
            style={{
              width: "18rem",
              height: "125px",
              cursor: "pointer",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.2s, box-shadow 0.2s", // Add smooth hover transitions
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 8px 12px rgba(0, 0, 0, 0.2)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
            }}
            onClick={() => {
              setSelectedUser(user);
              fetchUserDetails(user.id);
            }}
          >
            <div style={{ padding: "20px" }}>
              <h5
                style={{
                  marginBottom: "10px",
                  fontSize: "1.25rem",
                  borderRadius: "5px",
                  backgroundColor: "#008080",
                  color: "white",
                  textAlign: "justify",
                  padding: "5px",
                }}
              >
                {user.fullName || "No Name"}
              </h5>
              <h6
                style={{
                  marginBottom: "8px",
                  fontSize: "1rem",
                  color: "#6c757d",
                }}
              >
                {user.email}
              </h6>
              <p style={{ marginBottom: "0", fontSize: "0.9rem" }}>
                {user.blogs.length} blog(s)
                {user.blogs.length} blog's
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* User Details Popup */}
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
              className="btn-close"
              style={{ marginLeft: "430px" }}
              onClick={closePopup}
            ></button>
            <h3 style={{ marginLeft: "7px" }}>
              Details for {selectedUser.fullname || "No Name"}
            </h3>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <p style={{ marginLeft: "7px" ,display: "flex", flexDirection: "row" }} >
                <b>Email: </b>{userDetails?.email || "N/A"}
              </p>{" "}
              <button
                className="btn-delete-user"
                onClick={() => handleDeleteUser(selectedUser.id)}
                style={{
                  background:"none",
                  marginTop: "5px",
                  color:"#008080",
                  border: "none",
                  borderRadius: "4px",
                  padding: "5px 10px",
                  cursor: "pointer",
                  marginRight: "20px",
                  marginLeft: "200px",
                }}
              >
                <FaTrash />{" "}
              </button>
            </div>
            <p style={{ marginLeft: "7px" }}>
              <b>Role:</b> {userDetails?.role || "User"}
            </p>

            <hr></hr>

            {selectedUser.blogs.length > 0 ? (
              <ul>
                {selectedUser.blogs.map((blog) => (
                  <li key={blog.id}>
                    <h4>{blog.title || "No Title"}</h4>
                    <p>{blog.content || "No Content"}</p>
                    <button
                      style={{
                        marginTop: "10px",
                        backgroundColor: "#008080",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "7px 10px",
                        cursor: "pointer",
                        marginRight: "20px",
                      }}
                      onClick={() => handleDeleteBlog(selectedUser.id, blog.id)}
                    >
                     <FaTrash/> Delete Blog
                    </button>
                    <button
                      style={{
                        marginTop: "10px",
                        backgroundColor: "#008080",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "5px 10px",
                        cursor: "pointer",
                        marginRight: "20px",
                      }}
                      onClick={() =>
                        handleApproveBlog(selectedUser.id, blog.id, blog.status)
                      }
                    >
                     < FaCheckCircle/>  Approve
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ marginLeft: "7px", marginTop: "20px" }}>
                No blogs available
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;