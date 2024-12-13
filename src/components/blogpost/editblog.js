import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import './blogpost.css';

const EditBlogPost = () => {
  const { postId } = useParams(); // Get postId from URL
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const [userId, setUserId] = useState(""); // Store userId
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (postId) {
      fetchBlogData();
    }
  }, [postId]);

  const fetchBlogData = async () => {
    setLoading(true);
    try {
      const postDoc = doc(db, "blogPosts", postId);
      const docSnapshot = await getDoc(postDoc);
      if (docSnapshot.exists()) {
        const postData = docSnapshot.data();
        setTitle(postData.title);
        setContent(postData.content);
        setTags(postData.tags);
        setCategory(postData.category);
        setUserId(postData.userId); // Set the userId from the post data
      } else {
        console.error("Document does not exist!");
      }
    } catch (error) {
      console.error("Error fetching document: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Prepare the updated blog data
      const blogData = {
        title,
        content,
        tags,
        imageUrl: image ? image.name : "", // If image is updated, use image name
        category,
        createdAt: new Date(),
      };
  
      // Update the blog post in the 'blogPosts' collection
      const postRef = doc(db, "blogPosts", postId);
      await updateDoc(postRef, blogData);
      console.log("Blog updated successfully!");
  
      // If userId is available, update user's blogs collection (optional)
      if (userId) {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const blogs = userData.blogs || [];
  
          // Instead of handling indices, simply map the blogs
          const updatedBlogs = blogs.map((blog) =>
            blog.id === postId ? { ...blog, ...blogData } : blog
          );
  
          // Update the user's blogs in the 'users' collection
          await updateDoc(userRef, { blogs: updatedBlogs });
          console.log("User's blog data updated successfully!");
        } else {
          console.error("User document does not exist");
        }
      }
  
      alert("Blog updated successfully!");
      navigate(`/blog/${postId}`); // After updating, navigate back to the blog post page
  
    } catch (error) {
      console.error("Error submitting form: ", error);
      alert("Error updating blog post. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="new-blog-post-container">
      <h2>Edit Blog Post</h2>
      <form onSubmit={handleSubmit} className="blog-form">
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter your blog title"
          />
        </label>

        <label>
          Content:
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="Write your blog content here..."
          />
        </label>

        <label>
          Tags (comma-separated):
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., React, JavaScript, Web Development"
          />
        </label>

        <label>
          Upload Cover Image:
          <input type="file" onChange={handleImageUpload} accept="image/*" />
        </label>

        <label>
          Category:
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>Select a category</option>
            <option value="Sports">Sports</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Health">Health</option>
            <option value="Business">Business</option>
            <option value="Culture">Culture</option>
            <option value="Tech">Tech</option>
            <option value="Fashion">Fashion</option>
            <option value="World">World</option>
          </select>
        </label>

        <button type="submit" className="submit-button">Update Blog</button>
      </form>
    </div>
  );
};

export default EditBlogPost;
