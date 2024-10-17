import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './health.css'; // Custom styles for the Health page

const HealthBlog = () => {
  const healthBlogs = [
    {
      id: 1,
      title: "The Benefits of Daily Yoga",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn_D5fvi_pSFlFwjlC-e8qMYZWRHzxOmaAQA&s",
    },
    {
      id: 2,
      title: "How to Maintain a Balanced Diet",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmtTK597n38G2XsiHz5yARxr5E3846nUNYvw&s", 
    },
    {
      id: 3,
      title: "Top 10 Mental Health Tips",
      imageUrl: "https://braintherapytms.com/wp-content/uploads/2021/09/Improving-Mental-Health-10-Tips.jpg", 
    },
    // Add more health articles as needed
  ];

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Health Articles</h1>
      <div className="row">
        {healthBlogs.map(blog => (
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

export default HealthBlog;
