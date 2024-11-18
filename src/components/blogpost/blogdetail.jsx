import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import './blogdetail.css';  // Import the CSS for styling

const BlogDetail = () => {
  const { id } = useParams();  // Get the blog post ID from the URL
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, 'blogPosts', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document: ", error);
      }
    };

    fetchPost();
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  // Check if the image URL is available; if not, use a default image from the public folder
  const imageUrl = post.imageUrl
    ? `/assests/images/food/${post.imageUrl}`  // Use an image from public/assets/images
    : '/assests/images/food/placeholder-image.jpg';  // Use a default placeholder image

  return (
    <div className="blog-detail-container">
      <div className="blog-header">
        <h2 className="blog-title">{post.title}</h2>
        {/* Display the image with the dynamic path */}
        {post.imageUrl && <img className="blog-image" src={imageUrl} alt={post.title} />}
      </div>

      <div className="blog-content">
        <p>{post.content}</p>
      </div>

      <div className="blog-meta">
        <p><strong>Category:</strong> {post.category}</p>
        <p><strong>Tags:</strong> {post.tags}</p>
      </div>
    </div>
  );
};

export default BlogDetail;
