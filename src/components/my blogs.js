import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaHeart, FaBookmark } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MyBlogUI = ({ myBlogs = [], currentUser = null, handleEdit, isLoading = false }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (myBlogs && currentUser) {
      // Only update the posts when myBlogs or currentUser changes
      const filteredPosts = myBlogs.filter(post => post.userId === currentUser.uid);
      setPosts(filteredPosts);
    }

  }, [myBlogs, currentUser]);  // This dependency array ensures the effect only runs when these props change

  const addToFavorites = (post) => {
    console.log('Added to favorites', post);
  };

  const addToBookmarks = (post) => {
    console.log('Added to bookmarks', post);
  };

  const truncateDescription = (text, length) => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-blogs-ui p-4">
      <h2 className="mb-4 text-center">My Blogs</h2>

      {posts.length > 0 ? (
        <div className="row justify-content-center">
          {posts.map((post) => (
            <div key={post.id} className="col-12 col-md-6 col-lg-4 mb-4 d-flex align-items-stretch">
              <div className="card shadow-sm border-0 w-100 position-relative blog-card">
                <img
                  src={post.imageUrl ? `/assets/images/food/${post.imageUrl}` : '/assets/images/food/placeholder-image.jpg'}
                  className="card-img-top"
                  alt={post.title}
                  loading="lazy"
                />
                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">{truncateDescription(post.content, 100)}</p>
                </div>

                <div className="d-flex justify-content-between align-items-center p-3">
                  <Link to={`/blog/${post.id}`} className="btn btn-sm" style={{ backgroundColor: 'teal', borderColor: 'teal', color: 'white' }}>
                    Read More
                  </Link>

                  <div className="icon-container d-flex gap-2">
                    <button className="btn btn-sm" onClick={() => addToFavorites(post)}>
                      <FaHeart style={{ color: 'teal' }} />
                    </button>
                    <button className="btn btn-sm" onClick={() => addToBookmarks(post)}>
                      <FaBookmark style={{ color: 'teal' }} />
                    </button>
                    <button className="btn btn-sm btn-warning" onClick={() => handleEdit(post.id)}>
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted">You haven’t posted any blogs yet. Start sharing your ideas!</p>
      )}
    </div>
  );
};

// Define prop types for validation
MyBlogUI.propTypes = {
  myBlogs: PropTypes.array,
  currentUser: PropTypes.object,
  handleEdit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default MyBlogUI;
