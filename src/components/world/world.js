import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './world.css';

const WorldPage = () => {
  const [worldBlogs, setWorldBlogs] = useState([]);

  useEffect(() => {
    fetchWorldBlogs();
  }, []);

  // Fetching data from Firestore
  const fetchWorldBlogs = async () => {
    const db = getFirestore();
    const worldCollection = collection(db, 'globalPosts'); // Firestore collection
    const q = query(worldCollection, where('category', '==', 'World'));

    try {
      const querySnapshot = await getDocs(q);
      const blogs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWorldBlogs(blogs);
    } catch (error) {
      console.error('Error fetching world blogs:', error);
    }
  };

  // Truncate content for preview
  const truncateDescription = (text, limit) => {
    if (text.length > limit) {
      return text.substring(0, limit) + '...';
    }
    return text;
  };

  return (
    <div className="world-container">
      <h2 className="text-center mb-5">World Blogs</h2>
      {worldBlogs.length === 0 ? (
        <p className="text-center">No blogs found in the World category.</p>
      ) : (
        <div className="row g-4">
          {worldBlogs.map((blog) => (
            <div key={blog.id} className="col-12 col-md-6 col-lg-4">
              <div className="card world-card shadow-sm">
                <img
                  src={blog.imageUrl ? blog.imageUrl : '/assets/images/world/placeholder-image-url.jpg'}
                  className="card-img-top"
                  alt={blog.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{blog.title}</h5>
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
}

export default WorldPage;
