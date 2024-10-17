import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './business.css'; // Custom styles for the Business page

const BusinessBlog = () => {
  const businessBlogs = [
    {
      id: 1,
      title: "The Future of Remote Work",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiNpCfUDIf7c58uKhME0EUAOTELXRamoatRg&s",
    },
    {
      id: 2,
      title: "Top 5 Investment Strategies for 2024",
      imageUrl: "https://businessprizm.com/wp-content/uploads/2024/06/New-Project-41-1200x675.webp", 
    },
    {
      id: 3,
      title: "How to Start a Small Business",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUZSRWionnaT_DL2gJXuBORtxo_TCx607cBQ&s", 
    },
    // Add more business articles
  ];

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Business Articles</h1>
      <div className="row">
        {businessBlogs.map(blog => (
          <div className="col-md-4 mb-4" key={blog.id}>
            <div className="card">
              <img src={blog.imageUrl} className="card-img-top" alt={blog.category} />
              <div className="card-body">
                <h5 className="card-title">{blog.title}</h5>
                <a href="#" className="btn btn-primary">Read More {blog.price}</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BusinessBlog;
