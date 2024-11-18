import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom'; // Use navigate for internal redirection

const BlogList = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null); // State for selected post
  const navigate = useNavigate(); // React Router navigate for page transition

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Fetch blog posts from Firestore
        const blogCollection = collection(db, 'blogPosts');
        const blogSnapshot = await getDocs(blogCollection);
        
        const blogList = blogSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBlogPosts(blogList);
      } catch (error) {
        console.error("Error fetching blog posts: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleReadMore = (postId) => {
    // Set selected post and navigate to the detailed view
    const post = blogPosts.find((post) => post.id === postId);
    setSelectedPost(post);  // Save post data for detail view
    navigate(`/blog/${postId}`);  // Navigate to the detailed page
  };

  if (loading) {
    return <div>Loading blogs...</div>;
  }

  return (
    <div className="blog-list-container">
      <h2>Blog Posts</h2>
      <div className="blog-list">
        {blogPosts.length === 0 ? (
          <p>No blog posts available.</p>
        ) : (
          blogPosts.map(post => (
            <div key={post.id} className="blog-item">
              <h3>{post.title}</h3>
              {post.imageUrl && <img src={post.imageUrl} alt={post.title} />}
              <p>{post.content.slice(0, 150)}...</p> {/* Preview content */}
              <p><strong>Category:</strong> {post.category}</p>
              <button onClick={() => handleReadMore(post.id)} className="read-more-button">
                Read More
              </button>
            </div>
          ))
        )}
      </div>

      {/* Optional: Render detailed view of selected post directly on the same page */}
      {selectedPost && (
        <div className="blog-detail">
          <h2>{selectedPost.title}</h2>
          <img src={selectedPost.imageUrl} alt={selectedPost.title} />
          <p>{selectedPost.content}</p>
          <p><strong>Category:</strong> {selectedPost.category}</p>
          <p><strong>Tags:</strong> {selectedPost.tags}</p>
        </div>
      )}
    </div>
  );
};

export default BlogList;
