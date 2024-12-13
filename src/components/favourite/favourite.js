import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

const FavouritePage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch favorites from Firestore
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
    
        console.log("Fetched favorites:", favoritesData);  // Log the fetched data for debugging
    
        setFavorites(favoritesData);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };
    

    fetchFavorites();
  }, []);

  // Handle removing a favorite permanently with feedback

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      const user = getAuth().currentUser;
      if (!user) throw new Error("User not authenticated.");
  
      console.log("Authenticated User UID:", user.uid);
      console.log("Attempting to remove favorite with ID:", favoriteId);
  
      // Reference to the specific favorite document under users/{userId}/favorites/{favoriteId}
      const favoriteDocRef = doc(db, "users", user.uid, "favorites", favoriteId);
  
      // Fetch the document to check if it exists
      const docSnap = await getDoc(favoriteDocRef);
  
      // Check if the document exists
      if (!docSnap.exists()) {
        console.error("Document does not exist at path:", favoriteDocRef.path);
        return;
      }
  
      console.log("Deleting document at path:", favoriteDocRef.path);
  
      // Delete the document from Firestore
      await deleteDoc(favoriteDocRef);
  
      // Update the state to reflect the removal in the UI
      setFavorites((prevFavorites) =>
        prevFavorites.filter((favorite) => favorite.id !== favoriteId)
      );
  
      console.log("Favorite deleted successfully.");
    } catch (error) {
      console.error("Error deleting favorite:", error);
    }
  };

  
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
                <div className="blog-actions d-flex justify-content-between align-items-center p-3">
                  <Link
                    to={`/blog/${favorite.id}`}
                    style={{
                      backgroundColor: "teal",
                      color: "#fff",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      textDecoration: "none",
                      fontSize: "16px",
                    }}
                  >
                    Read More
                  </Link>
                  <button
                    onClick={() => handleRemoveFavorite(favorite.id)}
                    style={{
                      backgroundColor: "teal",
                      color: "#fff",
                      border: "none",
                      padding: "10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <FaTrash />
                  </button>
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
