import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';  // Firebase config

const BlogPost = () => {
  const { id } = useParams();  // Get the blog ID from the URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, 'globalPosts', id);  // Reference the blog in Firestore
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost(docSnap.data());
        } else {
          setError('Blog post not found');
        }
      } catch (err) {
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Format the date
  const formattedDate = post?.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'No date available';

  return (
    <div className="container mt-5" style={{ overflowY: "scroll", maxHeight: "650px", maxWidth: "1500px" }}>
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Card Container with custom styles */}
          <div className="card mb-4 shadow-lg">
            <div className="row g-0">
              {/* Left side: Image */}
              <div className="col-md-5">
                <img
                  src={post?.imageUrl || 'https://via.placeholder.com/400x250'}
                  className="card-img-top"
                  alt={post?.title || 'Blog image'}
                />
              </div>

              {/* Right side: Content */}
              <div className="col-md-7">
                <div className="card-body">
                  {/* Title */}
                  <h5 className="card-title">{post?.title}</h5>

                  {/* Content */}
                  <p className="card-text">{post?.content}</p>

                  {/* Tags Section */}
                  <div className="tags">
                    {post?.tags?.map((tag, index) => (
                      <span key={index} className="badge bg-primary me-2">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default BlogPost;
