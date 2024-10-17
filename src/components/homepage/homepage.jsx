// HomePage.js
import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import './homepage.css';
import { FaSearch, FaBell, FaUserCircle } from 'react-icons/fa'; // Font Awesome Icons


const HomePage = () => {
  const recentBlogs = [
    { 
      id: 1,
      title: "Top 5 Fitness Tips",
      image: "https://dropinblog.net/34243643/files/featured/Mental_Health.png",
      description: "Some brief details about the blog...",
      author: "John Doe",
      releaseDate: "2024-07-21"
    },
    {
      id: 2,
      title: "Fashion Trends 2024",
      image: "https://www.azafashions.com/blog/wp-content/uploads/2024/01/9-Fashion-Trends-In-2024.jpg",
      description: "Some brief details about the blog...",
      author: "Jane Smith",
      releaseDate: "2024-01-15"
    },
    { 
      title: "How to Manage Finances",  
      image: "https://www.invoiceowl.com/wp-content/webp-express/webp-images/doc-root/wp-content/uploads/2021/06/most-valuable-tips-to-manage-your-business-finances.jpg.webp" 
    },
    { 
      title: "Best Vacation Spots",
      image: "https://www.tourism-of-india.com/blog/wp-content/uploads/2021/08/visit-places-outside-india-in-september.jpg"
    },
    { 
      title: "Latest Sports Updates", 
      image: "https://c.ndtvimg.com/2024-07/fhkrif9_india-women_625x300_28_July_24.jpeg?im=FeatureCrop,algorithm=dnn,width=806,height=605" 
    },
    { 
      title: "The Rise of World Culture",
      image: "https://media.licdn.com/dms/image/D5612AQEEIyj7ZT0x3w/article-cover_image-shrink_720_1280/0/1685241402872?e=2147483647&v=beta&t=efAimCH9dNo1ZDcidVWWv7qhZzlksEfoGPlVnnk5HYM" 
    },
    { title: "Healthy Eating Habits", 
      image: "https://media.licdn.com/dms/image/D4D12AQHzfWXak7ttgg/article-cover_image-shrink_720_1280/0/1683570607828?e=2147483647&v=beta&t=f6PdFAvZKbrMMtCDyiLZlRQ4UJfP7mEV2q2ov5knjKo" 

    },
    { title: "Business Startup Tips",
     image: "https://smallbusiness.patriotsoftware.com/wp-content/uploads/2020/10/Tips-for-starting-a-business-2-1.png" 
    }
  ];

  // Trending Blogs data
  const trendingBlogs = [
    { 
      title: "Mastering Web Development", 
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs-VIJ5EUMYvvAVzWp1AQqKxS4f8ultkU83A&s" 
    },
    { 
      title: "Top 10 Travel Destinations", 
      image: "https://www.freelivejob.com/wp-content/uploads/2024/01/10-Best-Destination-in-Europe-for-Cultural-Tourism.jpg" 
    },
    { 
      title: "Improving Mental Health", 
      image: "https://braintherapytms.com/wp-content/uploads/2021/09/Improving-Mental-Health-10-Tips.jpg" 
    },
    { 
      title: "The Power of Yoga", 
      image: "https://media.licdn.com/dms/image/D5612AQE8qjyQGzLh9w/article-cover_image-shrink_720_1280/0/1722319538361?e=2147483647&v=beta&t=wh2MLmtwsForuovJH2LkMWxg_dR01rifLNNsoz1C0Io" 
    },
    { 
      title: "Emerging Tech Trends", 
      image: "https://www.clariontech.com/hubfs/Top%20Emerging%20Technologies%202023.webp" 
    },
    { 
      title: "Understanding Cryptocurrency", 
      image: "https://miro.medium.com/v2/resize:fit:1400/0*x_hbHvoDk3-itD2y.png" 
    },
    { 
      title: "Minimalist Lifestyle", 
      image: "https://static.wixstatic.com/media/6f0f0e_f14d519d9ee244f4adc9fe16b2600006~mv2.png/v1/fill/w_520,h_676,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/6f0f0e_f14d519d9ee244f4adc9fe16b2600006~mv2.png" 
    },
    { 
      title: "The Art of Mindfulness", 
      image: "https://miro.medium.com/v2/resize:fit:1400/1*LHZLGgu_2ETVzyOrD4dTVQ.jpeg" 
    }
  ];

  const categories = [
    { name: "Sports", link: "./sports" },
    { name: "Health", link: "./health" },
    { name: "Business", link: "./business" },
    { name: "Culture", link: "./culture" },
    { name: "Fashion", link: "./fashion" },
    { name: "World", link: "./world" },
    { name: "Tech", link: "./tech" },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container-fluid homepage vh-100 d-flex flex-column">
      {/* Navigation Menu */}
      <nav className="navbar navbar-expand-lg navbar-dark custom-navbar shadow-sm">
        <a className="navbar-brand blog-logo" href="/">TealSphere</a> 
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mr-auto">
            {categories.map((category, index) => (
              <li key={index} className="nav-item">
                <a className="nav-link" href={category.link}>{category.name}</a>
              </li>
            ))}
          </ul>



          {/* Search Bar, Notification, and Profile Icons */}
          <form className="form-inline my-2 my-lg-0 mx-auto d-flex align-items-center">
            <input 
              className="form-control mr-sm-2" 
              type="search" 
              placeholder="Search blogs..." 
              value={searchTerm}
              onChange={handleSearch} 
              aria-label="Search"
            />
            <button className="btn btn-outline-light my-2 my-sm-0" type="submit">
              <FaSearch />
            </button>
          </form>

          {/* Right Aligned Icons */}
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a href="/notifications" className="nav-link">
                <FaBell size={20} />
              </a>
            </li>
            <li className="nav-item">
              <a href="/profile" className="nav-link">
                <FaUserCircle size={22} />
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Highlights of Recent Blogs */}
      <section className="recent-blogs mt-5">
        <h2 className="text-center">Recent Blogs</h2>
        <div className="row justify-content-center mt-4">
          {recentBlogs.filter(blog => 
            blog.title.toLowerCase().includes(searchTerm.toLowerCase())
          ).map((blog, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-3 mb-4 d-flex align-items-stretch">
              <div className="card shadow-sm border-0 w-100">
                <img src={blog.image} className="card-img-top" alt={blog.title} />
                <div className="card-body">
                  <h5 className="card-title">{blog.title}</h5>
                  <Link to={`/blog/${blog.id}`} className="btn btn-primary">
                  Read More
                </Link>               
                 </div>
              </div>
            </div>
          ))}
        </div>
      </section>



      {/* Trending Blogs Section */}
      <section className="trending-blogs mt-5">
        <h2 className="text-center">Trending Blogs</h2>
        <div className="row justify-content-center mt-4">
          {trendingBlogs.filter(blog => 
            blog.title.toLowerCase().includes(searchTerm.toLowerCase())
          ).map((blog, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-3 mb-4 d-flex align-items-stretch">
              <div className="card shadow-sm border-0 w-100">
                <img src={blog.image} className="card-img-top" alt={blog.title} />
                <div className="card-body text-center">
                  <h5 className="card-title">{blog.title}</h5>
                  <a href={`#${blog.title.split(' ').join('-').toLowerCase()}`} className="btn btn-outline-primary btn-block">Read More</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
    
  );
};

export default HomePage;