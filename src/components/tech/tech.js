import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './tech.css';

const TechPage = () => {
  const [techBlogs, setTechBlogs] = useState([]);

  useEffect(() => {
    fetchTechBlogs();
  }, []);

  const fetchTechBlogs = async () => {
    const db = getFirestore();
    const techCollection = collection(db, 'globalPosts'); // Firestore collection
    const q = query(techCollection, where('category', '==', 'Tech'));

    try {
      const querySnapshot = await getDocs(q);
      const blogs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTechBlogs(blogs);
    } catch (error) {
      console.error('Error fetching tech blogs:', error);
    }
  };

  const truncateDescription = (text, limit) => {
    if (text.length > limit) {
      return text.substring(0, limit) + '...';
    }
    return text;
  };

  return (
    <div className="tech-container">
      <h2 className="text-center mb-5">Tech Blogs</h2>
      {techBlogs.length === 0 ? (
        <p className="text-center">No blogs found in the Tech category.</p>
      ) : (
        <div className="row g-4">
          {techBlogs.map((blog) => (
            <div key={blog.id} className="col-12 col-md-6 col-lg-4">
              <div className="card tech-card shadow-sm">
              <img
                  src={blog.imageUrl ? blog.imageUrl : '/assets/images/world/placeholder-image-url.jpg'}
                  className="card-img-top"
                  alt={blog.title}
                />

                <div className="card-body">
                  <h5 className="card-title">{blog.title}</h5>
                  <p className="card-text">{truncateDescription(blog.content, 100)}</p>
                  <p className="tags">
                    <strong>Tags:</strong> {blog.tags}
                  </p>
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

export default TechPage;
