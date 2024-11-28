import React, { useState, useEffect } from 'react';
import { fetchBlogPosts } from '../firebase/firestore';
import { FaHeart, FaBookmark } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../firebase';
import './myblog.css';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const posts = await fetchBlogPosts();
        setPosts(posts);
      } catch (err) {
        setError(err.message || 'Failed to fetch posts.');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handleReadMore = (postId) => {
    // Navigate to the BlogPost page when Read More is clicked
    navigate(`/blog/${postId}`);
  };

  const truncate = (text, length) => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  return (
    <div className="blog-list-container">
      <h2 className="blog-title">All Blogs</h2>
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : posts.length > 0 ? (
        <ul className="blog-list">
          {posts.map((post) => (
            <li key={post.id} className="blog-item">
              <div className="blog-card">
                <img
                  src={post.imageUrl || '/assets/images/food/placeholder-image-url.jpg'}
                  className="card-img-top"
                  alt={post.title || 'Blog image'}
                />
                <div className="card-body">
                  {/* Truncate Title */}
                  <h3 className="blog-item-title">
                    {truncate(post.title, 30)} {/* Truncate title to 30 characters */}
                  </h3>
                  <p className="blog-description">
                    {post.content.substring(0, 100)}...
                  </p>
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
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-blogs-text">No blogs found.</p>
      )}
    </div>
  );
};

export default BlogList;
