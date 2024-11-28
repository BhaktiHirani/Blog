import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './business.css';

const BusinessPage = () => {
  const [businessBlogs, setBusinessBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBusinessBlogs();
  }, []);

  // Fetching business blogs from Firestore
  const fetchBusinessBlogs = async () => {
    const db = getFirestore();
    const businessCollection = collection(db, 'globalPosts'); // Firestore collection
    const q = query(businessCollection, where('category', '==', 'Business'));

    try {
      const querySnapshot = await getDocs(q);
      const blogs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBusinessBlogs(blogs);
    } catch (error) {
      setError('Error fetching business blogs. Please try again later.');
      console.error('Error fetching business blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Truncate content for a preview
  const truncateDescription = (text, limit) => {
    if (text.length > limit) {
      return text.substring(0, limit) + '...';
    }
    return text;
  };

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-danger">{error}</p>;
  }

  return (
    <div className="business-container">
      <h2 className="text-center mb-5">Business Blogs</h2>
      {businessBlogs.length === 0 ? (
        <p className="text-center">No blogs found in the Business category.</p>
      ) : (
        <div className="row g-4">
          {businessBlogs.map((blog) => (
            <div key={blog.id} className="col-12 col-md-6 col-lg-4">
              <div className="card business-card shadow-sm">
                <img
                  src={blog.imageUrl || '/assets/images/business/placeholder-image-url.jpg'}
                  className="card-img-top"
                  alt={blog.title || 'Blog image'}
                />
                <div className="card-body">
                  <h5 className="card-title">{blog.title || 'Untitled'}</h5>
                  <p className="card-text">{truncateDescription(blog.content, 100)}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <Link to={`/post/${blog.id}`} className="btn btn-secondary">
                      Read More
                    </Link>
                    <button
                      className="btn btn-sm mt-2"
                      title="Bookmark this blog"
                      onClick={() => console.log('Bookmarking blog', blog.id)}
                    >
                      <i className="fas fa-bookmark"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusinessPage;
