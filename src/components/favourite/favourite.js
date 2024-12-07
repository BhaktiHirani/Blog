// FavouritePage.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

const FavouritePage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const user = getAuth().currentUser;
        if (!user) throw new Error("User not authenticated.");

        const favoritesCollection = collection(db, "users", user.uid, "favorites");
        const favoritesSnapshot = await getDocs(favoritesCollection);
        const favoritesData = favoritesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFavorites(favoritesData);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center">Your Favorites</h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : favorites.length === 0 ? (
        <p className="text-center">No favorite blogs yet.</p>
      ) : (
        <div className="row">
          {favorites.map((favorite) => (
            <div className="col-12 col-sm-6 col-md-3 mb-4" key={favorite.id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={favorite.imageUrl || "/placeholder-image.jpg"}
                  className="card-img-top"
                  alt={favorite.title || "Favorite Blog"}
                />
                <div className="card-body">
                  <h5 className="card-title">{favorite.title}</h5>
                  <p className="card-text">{favorite.description}</p>
                </div>
                <div className="blog-actions">
                  <Link to={`/blog/${favorite.id}`} className="btn btn-primary">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavouritePage;
