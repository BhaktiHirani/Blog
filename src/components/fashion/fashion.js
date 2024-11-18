import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './fashion.css';

const Fashion = () => {
  const [fashionItems, setFashionItems] = useState([]);

  useEffect(() => {
    fetchFashionItems();
  }, []);

  const fetchFashionItems = async () => {
    const db = getFirestore();
    const fashionCollection = collection(db, 'blogPosts'); // Firestore collection
    const q = query(fashionCollection, where('category', '==', 'Fashion'));

    try {
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFashionItems(items);
    } catch (error) {
      console.error('Error fetching fashion items:', error);
    }
  };

  const truncateDescription = (text, limit) => {
    if (text.length > limit) {
      return text.substring(0, limit) + '...';
    }
    return text;
  };

  return (
    <div className="fashion-container">
      <h2 className="text-center mb-5">Fashion Blogs</h2>
      {fashionItems.length === 0 ? (
        <p className="text-center">No blogs found in the Fashion category.</p>
      ) : (
        <div className="row g-4">
          {fashionItems.map((item) => (
            <div key={item.id} className="col-12 col-md-6 col-lg-4">
              <div className="card fashion-card shadow-sm">
              <img
  src={item.imageUrl ? `/assests/images/food/${item.imageUrl}` : '/assests/images/food/placeholder-image-url.jpg'}
  className="card-img-top"
  alt={item.title}
/>

                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text">{truncateDescription(item.content, 100)}</p>
                  <p className="tags">
                    <strong>Tags:</strong> {item.tags}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <Link to={`/post/${item.id}`} className="btn btn-secondary">
                      Read More
                    </Link>
                    <button
                      className="btn btn-sm mt-2"
                      title="Bookmark this blog"
                      onClick={() => console.log('Bookmarking blog', item.id)}
                    >
                      <i className="fas fa-bookmark"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Fashion;
