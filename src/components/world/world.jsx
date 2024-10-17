import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './world.css'; // Custom styles for the World page

const WorldBlog = () => {
  const worldBlogs = [
    {
      id: 1,
      title: "Global Economic Trends in 2024",
      imageUrl: "https://www.imf.org/-/media/Images/IMF/Blog/Articles/Blog-Charts/2023/May/COTW-Final-Growth-contributions-chart.ashx", 
    },
    {
      id: 2,
      title: "Climate Change: What You Need to Know",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtMf6_T6AhD6seRWSGYIWqJnaA41A1dIMRqA&s", 
    },
    {
      id: 3,
      title: "The Rise of Geopolitical Tensions",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBo-YjF0Y-4BOz0eMmT85RRY46Eho-Cr-v9w&s",
    },
    // Add more world articles
  ];

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">World Articles</h1>
      <div className="row">
        {worldBlogs.map(blog => (
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

export default WorldBlog;
