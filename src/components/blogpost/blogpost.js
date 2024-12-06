import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase"; // Use Firestore only for data storage
import { doc, setDoc, serverTimestamp, collection, updateDoc } from "firebase/firestore";
import "./blogpost.css";


const NewBlogPost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(""); // Store the base64 image
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [imagePreview, setImagePreview] = useState(""); // Image preview for user

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
      setUserName(user.displayName || "Anonymous"); // Assuming `displayName` is available
    } else {
      alert("Please log in to create a blog post.");
    }
  }, []);

  // Convert image file to base64 format
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result); // Store base64 string in state
        setImagePreview(reader.result); // Update image preview
      };
      reader.readAsDataURL(file);
      setImage(file);
    }
  };

  // Submit function for the blog post form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!title || !content || !tags || !category || !imageBase64) {
      alert("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      // Generate a unique postId
      const postId = doc(collection(db, "globalPosts")).id; // Generate an ID

      // Prepare blog data
      const blogData = {
        title,
        content,
        tags: tags.split(",").map((tag) => tag.trim()), // Split tags and remove extra spaces
        category,
        imageUrl: imageBase64, // Use base64 string
        createdAt: serverTimestamp(),
        createdBy: userId,
        createdByName: userName, // Include username for easier admin visibility
        status: "Pending",
      };

      // Save to user's blogPosts sub-collection
      await setDoc(doc(db, "users", userId, "blogPosts", postId), blogData);

      // Save to globalPosts collection
      await setDoc(doc(db, "globalPosts", postId), blogData);

      alert("Blog post created successfully!");
      resetForm();
    } catch (error) {
      console.error("Error creating blog post:", error);
      alert("Failed to create blog post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to reset the form fields
  const resetForm = () => {
    setTitle("");
    setContent("");
    setTags("");
    setCategory("");
    setImage(null);
    setImageBase64("");
    setImagePreview(""); // Reset image preview
  };

  // Optional: Update post status (for admins, etc.)
  const updatePostStatus = async (postId, newStatus) => {
    const postRef = doc(db, "globalPosts", postId);
    await updateDoc(postRef, { status: newStatus });
  };

  return (
    <div className="new-blog-post-container">
      <h2>Create a New Blog Post</h2>
      <form onSubmit={handleSubmit} className="blog-form">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your blog title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            className="form-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog content here..."
            rows="6"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags (comma-separated):</label>
          <input
            id="tags"
            type="text"
            className="form-input"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., React, Firebase, Blog"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            <option value="Sports">Sports</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Health">Health</option>
            <option value="Business">Business</option>
            <option value="Culture">Culture</option>
            <option value="Fashion">Fashion</option>
            <option value="World">World</option>
            <option value="Tech">Tech</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="image">Upload Image:</label>
          <input
            id="image"
            type="file"
            className="form-input"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>

        {imageBase64 && (
          <div className="preview">
            <p>Image Preview:</p>
            <img src={imageBase64} alt="Preview" style={{ maxWidth: "100%" }} />
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default NewBlogPost;
