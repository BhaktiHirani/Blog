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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Blog Post Title (Centered) */}
          <h1 className="display-3 text-center font-weight-bold mb-4">{post?.title}</h1>

          {/* Blog Post Image (Full-width and centered) */}
          <img
            src={post.imageUrl || '/assets/images/food/placeholder-image-url.jpg'}
            className="img-fluid rounded mb-4"
            alt={post.title || 'Blog image'}
            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
          />

          {/* Blog Post Content (Centered) */}
          <div className="blog-content text-center">
            <p className="lead mb-4">{post?.content}</p>
          </div>


          {/* Tags Section (Centered) */}
          <div className="tags text-center mt-3">
            {post?.tags?.map((tag, index) => (
              <span key={index} className="badge bg-secondary me-2">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
