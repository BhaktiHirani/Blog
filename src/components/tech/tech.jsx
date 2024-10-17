import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './tech.css'; // Custom styles for the Tech page

const TechBlog = () => {
  const techBlogs = [
    {
      id: 1,
      title: "The Future of AI in Everyday Life",
      imageUrl: "https://be10x.in/wp-content/uploads/2024/01/Impact-of-AI-on-Everyday-Life-1024x576.jpg",
    },
    {
      id: 2,
      title: "Top 5 Gadgets of 2024 You Need to Know About",
      imageUrl: "https://theunitedindian.com/images/gadgets-20-05-24-E-Hero.webp", 
    },
    {
      id: 3,
      title: "How Blockchain is Revolutionizing FinTech",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2wpDqOsmmO66R06HMr25bE7R5glLk1KPPHQ&s",
    },
    // Add more tech articles
  ];

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Tech Articles</h1>
      <div className="row">
        {techBlogs.map(blog => (
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

export default TechBlog;
