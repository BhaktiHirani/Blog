import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './fashion.css';

const FashionPage = () => {
  const [fashionBlogs, setFashionBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFashionBlogs();
  }, []);

  const fetchFashionBlogs = async () => {
    const db = getFirestore();
    const postsCollection = collection(db, 'globalPosts');
    const q = query(postsCollection, where('category', '==', 'Fashion'));

    try {
      const querySnapshot = await getDocs(q);
      const blogs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFashionBlogs(blogs);
    } catch (error) {
      setError('Error fetching fashion blogs. Please try again later.');
      console.error('Error fetching fashion blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="fashion-container">
      <h2>Fashion Blogs</h2>
      <div className="row">
        {fashionBlogs.map((blog) => (
          <div key={blog.id} className="col-12 col-md-6 col-lg-4">
            <div className="card">
              <img src={blog.imageUrl || '/placeholder.jpg'} alt={blog.title} />
              <div className="card-body">
                <h5>{blog.title}</h5>
                <p>{blog.content.substring(0, 100)}...</p>
                <Link to={`/post/${blog.id}`} className="btn btn-primary">
                  Read More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FashionPage;
