import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Your Firestore initialization
import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, "users");
      try {
        const userDocs = await getDocs(usersCollection);

        // Fetch the blogPosts subcollection for each user
        const usersData = await Promise.all(
          userDocs.docs.map(async (userDoc) => {
            const userId = userDoc.id;
            const userData = userDoc.data();

            // Fetch the blogPosts subcollection for the current user
            const blogPostsCollection = collection(db, "users", userId, "blogPosts");
            const blogDocs = await getDocs(blogPostsCollection);

            // Map the blog documents for the current user
            const userBlogs = blogDocs.docs.map((blogDoc) => ({
              id: blogDoc.id,
              ...blogDoc.data(), // Includes title, content, etc.
            }));

            return {
              id: userId,
              ...userData,
              blogs: userBlogs,
            };
          })
        );

        setUsers(usersData); // Set users and their blog posts
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users and blogs:", error);
        setError("Failed to fetch users or blogs.");
        setLoading(false);
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
          fullName: userData.fullName || "No Name Provided", // Fallback value
          email: userData.email || "N/A",
          role: userData.role || "User", // Fallback value
        });
      } else {
        console.log("No such user!");
      }
    } catch (error) {
      console.error("Error fetching user details: ", error);
    }
  };

  return (
    <div className="dashboard">
      <div className="user-list">
        {/* List users */}
        {users.map((user) => (
          <div
            key={user.id}
            className="user-box"
            onClick={() => {
              setSelectedUser(user);
              fetchUserDetails(user.id); // Fetch details when a user is selected
            }}
          >
            <h5>{user.fullName}</h5>
            <p>{user.email}</p>
            <p>{user.blogs.length} blog(s)</p>
          </div>
        ))}
      </div>

      {selectedUser && (
        <div className="user-details">
          <h3>Details for {selectedUser.fullName}</h3>
          <div>
            <p>Email: {userDetails?.email}</p>
            <p>Role: {userDetails?.role}</p>
          </div>

          {/* Show blog posts for the selected user */}
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
      )}
    </div>
  );
};

export default Dashboard;
