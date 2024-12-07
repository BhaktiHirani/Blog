import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  getDoc,query, where
} from "firebase/firestore";import { db } from "../../firebase";
import { getAuth } from "firebase/auth";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import {
  FaSearch,  FaUserCircle, FaSignOutAlt, FaBars, FaFacebookF,
  FaTwitter, FaInstagram, FaLinkedinIn, FaHeart, FaBookmark, FaHome,
   FaInfoCircle, FaListAlt, 
} from 'react-icons/fa';
import "bootstrap/dist/css/bootstrap.min.css";
import "./homepage.css";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBlogs, setFilteredPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const results = posts.filter(
      (post) =>
        post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(results);
  }, [searchTerm, posts]);
  
 
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const userDocs = await getDocs(usersCollection);
        const usersData = await Promise.all(
          userDocs.docs.map(async (userDoc) => {
            const userId = userDoc.id;
            const userData = userDoc.data();
            const blogPostsCollection = collection(db, "users", userId, "blogPosts");
            const blogDocs = await getDocs(blogPostsCollection);
            const blogs = blogDocs.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            return { id: userId, ...userData, blogs };
          })
        );
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Failed to load users.");
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteBlog = async (userId, blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await deleteDoc(doc(db, "users", userId, "blogPosts", blogId));
      setSelectedUser((prevUser) => ({
        ...prevUser,
        blogs: prevUser.blogs.filter((blog) => blog.id !== blogId),
      }));
      alert("Blog deleted successfully!");
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog.");
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      setUserDetails(userDoc.exists() ? userDoc.data() : null);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  


  // Fetch posts from Firestore
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const user = getAuth().currentUser;
        if (!user) throw new Error("User not authenticated.");

        const postsQuery = query(
          collection(db, "globalPosts"), // Collection reference
          where("status", "==", "Approved") // Filter by status
        );

        const querySnapshot = await getDocs(postsQuery);

        if (!querySnapshot.empty) {
          const postsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPosts(postsData);
        } else {
          setPosts([]); // Set empty array if no approved posts
        }
      } catch (err) {
        setError(err.message || "Failed to load posts.");
      } finally {
        setLoading(false); // Stop loading spinner or state
      }
    };

    fetchPosts();
  }, []);
  const handleReadMore = (postId) => {
    // Navigate to the BlogPost page when Read More is clicked
    navigate(`/blog/${postId}`);
  };

  const truncateText = (text, length = 100) => {
    if (text && text.length > length) {
      return text.substring(0, length) + '...';
    }
    return text || ''; // Return an empty string if the text is undefined or null
  };

  // Search functionality
  const filteredPosts = posts.filter((post) =>
    post.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Categories
  const categories = [
    { name: "Sports", link: "/sportsblog" },
    { name: "Health", link: "/health" },
    { name: "Business", link: "/business" },
    { name: "Culture", link: "/culture" },
    { name: "Fashion", link: "/fashion" },
    { name: "World", link: "/world" },
    { name: "Tech", link: "/tech" },
  ];

  

  return (
    <div className="container-fluid homepage vh-100 d-flex flex-column"    style={{overflow:"scroll",maxHeight:"800px"}}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark custom-navbar shadow-sm">
        <div className="container-fluid">
          <button
            className="btn btn-outline-light me-2"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasMenu"
            aria-controls="offcanvasMenu"
          >
            <FaBars />
          </button>
          <div className="logo-container">
            <div className="logo">
              <div className="logo-icon">
                <div className="pen"></div>
                <div className="book"></div>
              </div>
              <div className="logo-text">BlogSphere</div>
            </div>
          </div>
          <div className="ml-auto d-flex align-items-center">
            <Link className="nav-link" to="/favourite"><FaHeart /></Link>
            <Link className="nav-link" to="/bookmark"><FaBookmark /></Link>
            <Link className="nav-link" to="/profile"><FaUserCircle /></Link>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className="offcanvas offcanvas-start text-bg-light"
        id="offcanvasMenu"
        style={{ width: "300px" }}
        tabIndex="-1"
        aria-labelledby="offcanvasMenuLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasMenuLabel">Menu</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className="list-unstyled">
            <li>
              <Link className="nav-link" to="/">
                <FaHome className="text-black" /> Home
              </Link>
            </li>
            <li>
              <Link className="nav-link" to="/myblog">
                <FaInfoCircle className="text-black" /> My Blog
              </Link>
            </li>
            <li>
              <Link className="nav-link" to="/aboutus">
                <FaInfoCircle className="text-black" /> About Us
              </Link>
            </li>
            <li>
              <div className="dropdown">
                <h6 className="dropdown-toggle text-black" data-bs-toggle="dropdown" aria-expanded="false">
                  <FaListAlt className="text-black" /> Categories
                </h6>
                <ul className="dropdown-menu">
                  {categories.map((category) => (
                    <li key={category.name}>
                      <Link className="dropdown-item" to={category.link}>{category.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
            <li>
              <Link className="nav-link" to="/login">
                <FaSignOutAlt className="text-black" /> Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="highlight-section">
        <div className="highlight-image-container">
          <img
            src="https://img.freepik.com/premium-photo/blogging-concept-web-blog-social-media-information-network-snugly_31965-577148.jpg"
            alt="Highlight about Blog"
            className="highlight-image"
          />
          <div className="highlight-text-overlay">
            <h2 className="highlight-title">Welcome to BlogSphere!</h2>
            <p className="highlight-description">
              Discover insightful articles, tips, and trends on various topics.
            </p>
            <div className="mx-auto">
        <div className="input-group mb-0 custom-search-input">
          <input
            type="text"
            className="form-control"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search posts"
          />
          <button className="btn btn-outline-secondary" type="button">
            <FaSearch />
          </button>
        </div>
      </div>
          </div>
        </div>
      </div>
      <div className="button-container">
    <Link to="/blogpost">
        <button className="add-blog-button">Add Blog</button>
    </Link>
</div>

      {/* Blog List */}
      <section className="recent-blogs mt-5">
      <h2 className="text-center">Recent Blogs</h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-danger">{error}</p>
      ) : filteredPosts.length > 0 ? (
        <div className="row">
          {filteredPosts.map((post) => (
              <div className="col-12 col-sm-6 col-md-3 mb-4" key={post.id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={post.imageUrl || "/placeholder-image.jpg"}
                  className="card-img-top"
                  alt={post.title || "Blog Post"}
                />
                <div className="card-body">
                  <h5 className="card-title">{truncateText(post.title, 50)}</h5>
                  <p className="card-text">{truncateText(post.tags?.join(", ") || "No Tags", 50)}</p>
                  <p className="card-text">{truncateText(post.description, 100)}</p>
                </div>
                <div className="blog-actions">
                  <button
                    className="read-more-link"
                    onClick={() => handleReadMore(post.id)}
                  >
                    Read More
                  </button>
                  <div className="action-buttons">
                    <button className="action-button">
                      <FaHeart />
                    </button>
                    <button className="action-button">
                      <FaBookmark />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No posts found.</p>
      )}
    </section>


{/* Footer section */}
      <footer>
  <div className="footer-container">
    <div className="footer-left">
      <h5>Contact Us</h5>
      <p>Email: contact@yourblog.com</p>
      <p>Phone: +123 456 7890</p>
    </div>
    
    <div className="col-md-4 mb-4 text-center">
                            <h5>Follow Us</h5>
                            <ul className="list-unstyled d-flex justify-content-center">
                                <li className="mx-2">
                                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-light">
                                        <FaFacebookF />
                                    </a>
                                </li>
                                <li className="mx-2">
                                    <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-light">
                                        <FaTwitter />
                                    </a>
                                </li>
                                <li className="mx-2">
                                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-light">
                                        <FaInstagram />
                                    </a>
                                </li>
                                <li className="mx-2">
                                    <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-light">
                                        <FaLinkedinIn />
                                    </a>
                                </li>
                            </ul>
                        </div>
    
    <div className="footer-right">
      <h5>About Us</h5>
      <p>Learn more about our blog and the team behind it.</p>
    </div>
  </div>
</footer>

    </div>
  );
};

export default HomePage;
