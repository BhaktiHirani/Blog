import React, { createContext, useContext, useState } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Add a post to favorites
  const addToFavorites = (post) => {
    setFavorites((prevFavorites) => [...prevFavorites, post]);
  };

  // Remove a post from favorites
  const removeFromFavorites = (id) => {
    setFavorites((prevFavorites) => prevFavorites.filter((post) => post.id !== id));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook for using favorites context
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
