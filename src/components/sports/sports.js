import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './sports.css';

const SportsPage = () => {
  const [sportsBlogs, setSportsBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSportsBlogs();
  }, []);

  // Fetching data from Firestore
  const fetchSportsBlogs = async () => {
    const db = getFirestore();
    const sportsCollection = collection(db, 'globalPosts'); // Firestore collection
    const q = query(sportsCollection, where('category', '==', 'Sports'));

    try {
      const querySnapshot = await getDocs(q);
      const blogs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSportsBlogs(blogs);
    } catch (error) {
      setError('Error fetching sports blogs. Please try again later.');
      console.error('Error fetching sports blogs:', error);
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
    <div className="sports-container">
      <h2 className="text-center mb-5">Sports Blogs</h2>
      {sportsBlogs.length === 0 ? (
        <p className="text-center">No blogs found in the Sports category.</p>
      ) : (
        <div className="row g-4">
          {sportsBlogs.map((blog) => (
            <div key={blog.id} className="col-12 col-md-6 col-lg-4">
              <div className="card sports-card shadow-sm">
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

export default SportsPage;
