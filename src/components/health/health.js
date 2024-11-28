import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './health.css';

const HealthPage = () => {
  const [healthBlogs, setHealthBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHealthBlogs();
  }, []);

  // Fetching data from Firestore
  const fetchHealthBlogs = async () => {
    const db = getFirestore();
    const healthCollection = collection(db, 'globalPosts'); // Firestore collection
    const q = query(healthCollection, where('category', '==', 'Health'));

    try {
      const querySnapshot = await getDocs(q);
      const blogs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHealthBlogs(blogs);
    } catch (error) {
      setError('Error fetching health blogs. Please try again later.');
      console.error('Error fetching health blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Truncate content for preview
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
    <div className="health-container">
      <h2 className="text-center mb-5">Health Blogs</h2>
      {healthBlogs.length === 0 ? (
        <p className="text-center">No blogs found in the Health category.</p>
      ) : (
        <div className="row g-4">
          {healthBlogs.map((blog) => (
            <div key={blog.id} className="col-12 col-md-6 col-lg-4">
              <div className="card health-card shadow-sm">
                <img
                  src={blog.imageUrl || '/assets/images/health/placeholder-image-url.jpg'}
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

export default HealthPage;
