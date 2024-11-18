// components/bookmark/BookmarkContext.js

import React, { createContext, useContext, useState } from 'react';

const BookmarkContext = createContext();

export const useBookmarks = () => {
  return useContext(BookmarkContext);
};

export const BookmarkProvider = ({ children }) => {
  // Initialize with an empty array to ensure it is always an array
  const [bookmarks, setBookmarks] = useState([]);

  const addToBookmarks = (post) => {
    setBookmarks((prevBookmarks) => [...prevBookmarks, post]);
  };

  const removeFromBookmarks = (postId) => {
    setBookmarks((prevBookmarks) => prevBookmarks.filter((post) => post.id !== postId));
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, addToBookmarks, removeFromBookmarks }}>
      {children}
    </BookmarkContext.Provider>
  );
};
