import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaEdit, FaBell, FaUserCircle, FaSignOutAlt, FaBars, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaHeart, FaBookmark, FaHome, FaPhoneAlt, FaInfoCircle, FaListAlt } from 'react-icons/fa';
import { db } from "../../firebase";
import { collection, getDocs, query, orderBy, addDoc } from "firebase/firestore";
import './homepage.css';
import { useFavorites } from '../../components/favourite/FavoritesContext';
import { useBookmarks } from '../../components/bookmark/BookmarkContext';



const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToFavorites } = useFavorites(); 
  const navigate = useNavigate(); // Initialize navigate hook 
  const { addToBookmarks } = useBookmarks(); 

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, "blogPosts"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts: ", error);
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleEditClick = (postId) => {
    navigate(`/edit-blog/${postId}`);
  };  

  const categories = [
    { name: "Sports", link: "./sports" },
    { name: "Health", link: "./health" },
    { name: "Business", link: "./business" },
    { name: "Culture", link: "./culture" },
    { name: "Fashion", link: "./fashion" },
    { name: "World", link: "./world" },
    { name: "Tech", link: "./tech" },
  ];


  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };


  const truncateDescription = (description, wordCount) => {
    if (!description) return '';
    const words = description.split(' ');
    return words.length > wordCount ? words.slice(0, wordCount).join(' ') + '...' : description;
  };

  return (
    <div className="container-fluid homepage vh-100 d-flex flex-column">
      <nav className="navbar navbar-expand-lg navbar-dark custom-navbar shadow-sm">
    <div className="container-fluid">
        {/* Toggle Button for Drawer */}
        <button
            className="btn btn-outline-light me-2"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasExample"
            aria-controls="offcanvasExample"
        >
            <FaBars />
        </button>

        {/* Left-side Logo */}
        <div className="logo-container">
            <div className="logo">
                <div className="logo-icon">
                    <div className="pen"></div>
                    <div className="book"></div>
                </div>
                <div className="logo-text">BlogSphere..</div>
            </div>
        </div>

        {/* Search Bar */}
        <div className="mx-auto">
            <div className="input-group mb-0 custom-search-input">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search blogs..."
                    value={searchTerm}
                    onChange={handleSearch}
                    aria-label="Search blogs"
                />
                <button className="btn btn-outline-secondary" type="button">
                    <FaSearch />
                </button>
            </div>
        </div>

        {/* Right-side Links */}
        <div className="ml-auto d-flex align-items-center">
    <Link className="nav-link" to="/favourite">
        <FaHeart />
    </Link>
    <Link className="nav-link" to="/bookmark">
        <FaBookmark />
    </Link>
    <Link className="nav-link" to="/profile">
        <FaUserCircle />
    </Link>
   
</div>

    </div>
</nav>



      <div
            className="offcanvas offcanvas-start text-bg-light"
            id="offcanvasExample" style={{ width: '300px' }}
            tabIndex="-1"
            aria-labelledby="offcanvasExampleLabel"
        >
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasExampleLabel">Menu</h5>
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
                    <a className="nav-link" href="/home">
                    <FaHome style={{ marginRight: '8px', color: 'black' }} /> Home
                    </a>
                    </li>
                    <li>
                    <a className="nav-link" href="/aboutus">
            <FaInfoCircle style={{ marginRight: '8px', color: 'black' }} /> About Us
        </a>                    </li>
                    <li>
    <div className="dropdown">
        <h6 className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            <FaListAlt style={{ marginRight: '8px', color: 'black' }} /> Categories
        </h6>
        <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="/sportsblog">Sports</a></li>
            <li><a className="dropdown-item" href="/health">Health</a></li>
            <li><a className="dropdown-item" href="/business">Business</a></li>
            <li><a className="dropdown-item" href="/culture">Culture</a></li>
            <li><a className="dropdown-item" href="/fashion">Fashion</a></li>
            <li><a className="dropdown-item" href="/world">World</a></li>
            <li><a className="dropdown-item" href="/tech">Tech</a></li>
        </ul>
    </div>
</li>
                    <li>
    <a className="nav-link" href="/login">
        <FaSignOutAlt style={{ marginRight: '8px', color: 'black' }} /> Logout
    </a>
</li>
                </ul>
            </div>
        </div>

        <div className="highlight-section">
    <div className="highlight-image-container">

    <img src="https://img.freepik.com/premium-photo/blogging-concept-web-blog-social-media-information-network-snugly_31965-577148.jpg" alt="Highlight about Blog" className="highlight-image" />
    <div className="highlight-text-overlay">
            <h2 className="highlight-title">Welcome to BlogSphere!</h2>
            <p className="highlight-description">
                Discover insightful articles, tips, and trends on various topics, 
                curated just for you.
            </p>
        </div>
    </div>
    <div className="button-container">
    <Link to="/blogpost">
        <button className="add-blog-button">Add Blog</button>
    </Link>
</div>
</div>

<section className="recent-blogs mt-5">
  <h2 className="text-center">Recent Blogs</h2>
  {loading ? (
    <p className="text-center">Loading...</p>
  ) : error ? (
    <p className="text-center text-danger">{error}</p>
  ) : (
    <div className="row justify-content-center mt-4">
      {posts
        .filter((post) => 
          post.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((post) => (
          <div key={post.id} className="col-12 col-md-6 col-lg-4 mb-4 d-flex align-items-stretch">
            <div className="card shadow-sm border-0 w-100 position-relative blog-card">
              {/* Image with lazy loading */}
              <img
                src={post.imageUrl ? `/assests/images/food/${post.imageUrl}` : '/assests/images/food/placeholder-image.jpg'}
                className="card-img-top"
                alt={post.title}
                loading="lazy"
              />

              <div className="card-body">
                {/* Title */}
                <h5 className="card-title">{post.title}</h5>
                
                {/* Truncated Description */}
                <p className="card-text">{truncateDescription(post.content, 15)}</p>

                              </div>

              {/* Icon Buttons for favorites, bookmarks, and editing */}
                <div className="d-flex justify-content-between align-items-center p-3">
                          <Link
              to={`/blog/${post.id}`}
              className="btn btn-sm"
              style={{ backgroundColor: 'teal', borderColor: 'teal', color: 'white' }}
            >
              Read More
            </Link>

                <div className="icon-container d-flex gap-2">
                  {/* Heart Button */}
<button
  className="btn  btn-sm"
  onClick={() => addToFavorites(post)}
>
  <FaHeart style={{ color: 'teal' }} />  {/* Teal color */}
</button>

{/* Bookmark Button */}
<button
  className="btn  btn-sm"
  onClick={() => addToBookmarks(post)}
>
  <FaBookmark style={{ color: 'teal' }} />  {/* Teal color */}
</button>

{/* Edit Button 
<button
  className="btn  btn-sm"
  onClick={() => handleEditClick(post.id)}
>
  <FaEdit style={{ color: 'teal' }} />  
</button>*/}

                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  )}
</section>

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

const Navbar = ({ searchTerm, onSearchChange }) => (
  <nav className="navbar navbar-expand-lg navbar-dark custom-navbar shadow-sm">
    <div className="container-fluid">
      <button className="btn btn-outline-light me-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample">
        <FaBars />
      </button>
      <div className="logo-container">
        <div className="logo">
          <div className="logo-text">BlogSphere</div>
        </div>
      </div>
      <div className="mx-auto">
        <div className="input-group custom-search-input">
          <input type="text" className="form-control" placeholder="Search blogs..." value={searchTerm} onChange={onSearchChange} />
          <button className="btn btn-outline-secondary" type="button">
            <FaSearch />
          </button>
        </div>
      </div>
      <div className="ml-auto d-flex align-items-center">
        <Link className="nav-link" to="/notification"><FaBell /></Link>
        <Link className="nav-link" to="/favourite"><FaHeart /></Link>
        <Link className="nav-link" to="/bookmark"><FaBookmark /></Link>
        <Link className="nav-link" to="/profile"><FaUserCircle /></Link>
      </div>
    </div>
  </nav>

);



const BlogCard = ({ post, truncateDescription }) => {
  const { imageUrl, title, content } = post;

  return (
    <div className="col-12 col-md-6 col-lg-3 mb-4 d-flex align-items-stretch">
      <div className="card shadow-sm border-0 w-100 position-relative blog-card">
        {/* Updated image tag */}
        <img
          src={imageUrl ? `/assests/images/food/${imageUrl}` : '/assests/images/food/placeholder-image.jpg'}          className="card-img-top"
          alt={title}
          loading="lazy" // Ensures the image is lazily loaded
        />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{truncateDescription(content, 15)}</p>
          <Link to={`/post/${post.id}`} className="stretched-link"></Link>
        </div>
      </div>
    </div>
  );
};




export default HomePage;
