import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './culture.css';

const CulturePage = () => {
  const [cultureBlogs, setCultureBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCultureBlogs();
  }, []);

  // Fetching data from Firestore
  const fetchCultureBlogs = async () => {
    const db = getFirestore();
    const cultureCollection = collection(db, 'globalPosts'); // Firestore collection
    const q = query(cultureCollection, where('category', '==', 'Culture'));

    try {
      const querySnapshot = await getDocs(q);
      const blogs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCultureBlogs(blogs);
    } catch (error) {
      setError('Error fetching culture blogs. Please try again later.');
      console.error('Error fetching culture blogs:', error);
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
    <div className="culture-container">
      <h2 className="text-center mb-5">Culture Blogs</h2>
      {cultureBlogs.length === 0 ? (
        <p className="text-center">No blogs found in the Culture category.</p>
      ) : (
        <div className="row g-4">
          {cultureBlogs.map((blog) => (
            <div key={blog.id} className="col-12 col-md-6 col-lg-4">
              <div className="card culture-card shadow-sm">
                <img
                  src={blog.imageUrl || '/assets/images/food/placeholder-image-url.jpg'}
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

export default CulturePage;
