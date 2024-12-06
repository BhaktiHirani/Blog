import React, {
  useState,
  useEffect,
  updateDoc,
  Timestamp,
  writeBatch,
} from "react";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  where,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebase"; // Your Firestore initialization

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [blogs, setBlogs] = useState([]);
  const handleDeleteBlog = async (userId, blogId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (!confirmDelete) return;

    try {
      const blogRef = doc(db, "users", userId, "blogPosts", blogId); // Adjust Firestore structure
      await deleteDoc(blogRef);
      alert("Blog deleted successfully!");

      // Update blogs in selectedUser
      const updatedBlogs = selectedUser.blogs.filter(
        (blog) => blog.id !== blogId
      );
      setSelectedUser((prevUser) => ({
        ...prevUser,
        blogs: updatedBlogs,
      }));
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete the blog. Please try again.");
    }
  };

  const fetchUserBlogs = async (userId) => {
    try {
      const blogPostsCollection = collection(db, "users", userId, "blogPosts");
      const blogDocs = await getDocs(blogPostsCollection);
      return blogDocs.docs.map((blogDoc) => ({
        id: blogDoc.id,
        ...blogDoc.data(),
      }));
    } catch (error) {
      console.error("Error fetching user blogs:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchPendingPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "globalPosts"));
        const posts = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((data) => data.status === "Pending");
        setPendingPosts(posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        alert("Failed to fetch posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingPosts();
  }, []);

  const fetchAndUpdateBlogs = async (userId) => {
    try {
      const blogs = await fetchUserBlogs(userId); // Fetch updated blog list
      setBlogs(blogs); // Update state
    } catch (error) {
      console.error("Error fetching updated blogs:", error);
    }
  };

  // Function to update both global and user-specific blog posts

  // Function to approve or decline a blog post
  const updateBlogStatus = async (postId, newStatus, userId = null) => {
    try {
      // 1. Update globalPosts
      const globalPostRef = doc(db, "globalPosts", postId);
      await updateDoc(globalPostRef, { status: newStatus });

      // 2. Optionally, update user's blogPosts if userId is provided
      if (userId) {
        const userPostRef = doc(db, "users", userId, "blogPosts", postId);
        await updateDoc(userPostRef, { status: newStatus });
      }

      alert("Blog status updated successfully!");
    } catch (error) {
      console.error("Error updating blog status:", error);
      alert("Failed to update blog status. Please try again.");
    }
  };

  const addBlogToAdminView = async (userId, postId, title, content) => {
    try {
      const blogRef = doc(db, `allBlogs/${postId}`);
      await setDoc(blogRef, {
        userId,
        postId,
        title,
        content,
        status: "Pending", // Default status
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Error adding blog to admin view:", error);
    }
  };

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
              to="/adminpanel"
            >
              Dashboard
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
              to="/adminpanel/pendingblogs"
            >
              Pending Blogs
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
              to="/adminpanel/manageusers"
            >
              Manage Users
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
              to="/adminpanel/setting"
            >
              Settings
            </Link>
          </li>
        </ul>
      </div>

      {/* User list */}
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
                {user.fullname || "No Name"}
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
                {user.blogs.length} blog's
              </p>
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
            style={{
              width: "900px",
              maxWidth: "90%",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <button
              className="btn-close position-absolute"
              style={{
                top: "10px",
                right: "10px",
                width: "10px",
                height: "10px",
              }}
              onClick={closePopup}
            ></button>
            <h3
              style={{
                width: "430px",
                borderRadius: "5px",
                backgroundColor: "#008080",
                color: "white",
                textAlign: "justify",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s, box-shadow 0.2s", // Add smooth hover transitions
              }}
            >
              Details for {selectedUser.fullName}
            </h3>
            <div>
              <p>
                <b>Email: </b>
                {userDetails?.email}
              </p>
              <p>
                <b>Role: </b>
                {userDetails?.role}
              </p>
            </div>
            {selectedUser.blogs.length > 0 ? (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {selectedUser.blogs.map((blog) => (
                  <div
                    className="card"
                    key={blog.id}
                    style={{
                      marginBottom: "20px", // Add gap between cards
                      padding: "15px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <li>
                      <h4>{blog.title || "No Title Available"}</h4>
                      <p>{blog.content || "No Content Available"}</p>
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
                          handleDeleteBlog(selectedUser.id, blog.id)
                        } // Use selectedUser.id
                      >
                        Delete
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
                        onClick={() => updateBlogStatus(blog.id, "Approved")}
                      >
                        Approve
                      </button>
                    
                    </li>
                  </div>
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
