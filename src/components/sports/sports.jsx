import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './sports.css'; // Custom styles for the Sports page

const SportsBlog = () => {
  const sportsBlogs = [
    {
      id: 1,
      title: "Top 10 Football Matches You Shouldn't Miss",
      imageUrl: "https://www.aljazeera.com/wp-content/uploads/2022/11/2022-10-30T133617Z_91028197_UP1EIAU11SF45_RTRMADP_3_SOCCER-ITALY-EMP-ATT-REPORT.jpg?w=770&resize=770%2C475",
    },
    {
      id: 2,
      title: "Cricket World Cup Highlights",
      imageUrl: "https://c.ndtvimg.com/2023-11/ihplrne_india-afp_625x300_02_November_23.jpg?im=FaceCrop,algorithm=dnn,width=806,height=605",
    },
    {
      id: 3,
      title: "The Rise of Esports",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTwDTgLQWM2AcEKCPbgsFZqnES77gLD-hovg&s",
    },
    // Add more sports articles
  ];

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Sports Articles</h1>
      <div className="row">
        {sportsBlogs.map(blog => (
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

export default SportsBlog;
