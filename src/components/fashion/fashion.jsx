import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
const FashionBlog = () => {
  const fashionBlogs = [
    {
      id: 1,
      title: "Top 10 Summer Fashion Trends",
      imageUrl: "https://vastrakar.com/wp-content/uploads/2024/02/Summer-Fashion-Trends.jpg.webp",
    },
    {
      id: 2,
      title: "How to Style Winter Coats",
      imageUrl: "https://i.ytimg.com/vi/PB0J33sUHGI/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCQCndxe3TxoSMo_YM_CB4Our9kEw",
    },
    {
      id: 3,
      title: "Street Style Icons You Need to Follow",
      imageUrl: "https://assets.vogue.com/photos/62f557d4f68d425eaff20450/master/pass/00-promo.jpg",
    },
    // Add more fashion articles
  ];

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Fashion Articles</h1>
      <div className="row">
        {fashionBlogs.map(blog => (
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

export default FashionBlog;
