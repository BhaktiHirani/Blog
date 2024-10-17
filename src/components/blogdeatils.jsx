import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './blogdetails.css'; // Import a CSS file for styling

// Sample blog data (can be fetched from an API)
const blogData = [
  { 
    id: 1,
    title: "Top 5 Fitness Tips",
    image: "https://dropinblog.net/34243643/files/featured/Mental_Health.png",
    content: "Here are the top 5 fitness tips to help you stay healthy and fit...",
    author: "John Doe",
    releaseDate: "2024-07-21",
    reviews: ["Great tips!", "Very useful information!"]
  },
  { 
    id: 2,
    title: "Fashion Trends 2024",
    image: "https://www.azafashions.com/blog/wp-content/uploads/2024/01/9-Fashion-Trends-In-2024.jpg",
    content: "Discover the latest fashion trends of 2024 that will define the year...",
    author: "Jane Smith",
    releaseDate: "2024-01-15",
    reviews: ["Loved the article!", "Fashion-forward ideas!"]
  },
  // Add more blogs here
];

const BlogDetail = () => {
  const { id } = useParams();
  const blog = blogData.find(blog => blog.id === parseInt(id));

  if (!blog) {
    return <div className="container">Blog not found</div>;
  }

  return (
    <div className="container blog-detail">
      <Link to="/" className="btn btn-secondary back-button">Back to Home</Link>
      <h1 className="blog-title">{blog.title}</h1>
      <img src={blog.image} alt={blog.title} className="img-fluid blog-image" />
      <div className="blog-meta">
        <p><strong>Author:</strong> {blog.author}</p>
        <p><strong>Release Date:</strong> {new Date(blog.releaseDate).toLocaleDateString()}</p>
      </div>
      <div className="blog-content">
        <p>{blog.content}</p>
      </div>

      {/* Display Reviews */}
      <h3>Reviews</h3>
      <ul className="reviews-list">
        {blog.reviews.length > 0 ? (
          blog.reviews.map((review, index) => (
            <li key={index} className="review-item">{review}</li>
          ))
        ) : (
          <li>No reviews yet.</li>
        )}
      </ul>
    </div>
  );
};

export default BlogDetail;
