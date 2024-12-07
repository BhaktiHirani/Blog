import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";

const FavouritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      const user = getAuth().currentUser;
      if (!user) {
        setError("Please log in to see your favorites.");
        setLoading(false);
        return;
      }

      try {
        const favoritesQuery = query(
          collection(db, "users", user.uid, "favorites")
        );

        const querySnapshot = await getDocs(favoritesQuery);
        const favoritesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFavorites(favoritesData);
      } catch (err) {
        setError(err.message || "Failed to load favorites.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="container">
      <h2>Your Favorite Blogs</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : favorites.length > 0 ? (
        <div className="row">
          {favorites.map((fav) => (
            <div className="col-md-3 mb-4" key={fav.id}>
              <div className="card h-100">
                <img
                  src={fav.imageUrl || "/placeholder-image.jpg"}
                  className="card-img-top"
                  alt={fav.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{fav.title}</h5>
                  <p className="card-text">{fav.description}</p>
                  <Link to={`/blog/${fav.postId}`} className="btn btn-primary">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No favorite blogs found.</p>
      )}
    </div>
  );
};

export default FavouritesPage;
