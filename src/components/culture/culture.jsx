import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './culture.css'; // Custom styles for the Culture page

const CultureBlog = () => {
  const cultureBlogs = [
    {
      id: 1,
      title: "Exploring the Rich Heritage of India",
      imageUrl: "https://miro.medium.com/v2/resize:fit:1200/1*B4DGPf1vGWr3OgNxci5TSg.jpeg", 
    },
    {
      id: 2,
      title: "The Evolution of Modern Art",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF8b2oZkLEN8T-qSIaoYbWpkNL3ynpZ8jr2A&s", 
    },
    {
      id: 3,
      title: "Traditional Festivals Around the World",
      imageUrl: "https://www.rvcj.com/wp-content/uploads/2023/09/TSA-RVCJ-BLOG-24.png", 
    },
    // Add more culture articles
  ];

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Culture Articles</h1>
      <div className="row">
        {cultureBlogs.map(blog => (
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

export default CultureBlog;
