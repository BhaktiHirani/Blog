// components/favourite/FavoritesPage.js

import React from 'react';
import { FaHeart } from 'react-icons/fa';
import { useFavorites } from '../../components/favourite/FavoritesContext';
import { Card, Button, Row, Col } from 'react-bootstrap'; // Import necessary components from Bootstrap
import './favourite.css';

const FavoritesPage = () => {
  const { favorites, removeFromFavorites } = useFavorites(); // Fetch favorites from context

  // Helper function to truncate text with dynamic limit and fallback
  const truncateText = (text, limit) => {
    if (!text) return ''; // Return empty string if no text is provided
    return text.length > limit ? `${text.substring(0, limit)}...` : text;
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">
        <FaHeart color="red" /> My Favorites
      </h2>

      <Row>
        {favorites.length > 0 ? (
          favorites.map((post) => (
            <Col key={post.id} md={4} sm={6} className="mb-4">
              <Card className="shadow-sm">
                {/* Image of the post */}
                <Card.Img
                  variant="top"
                  src={post.image || '/assests/images/food/placeholder.jpg'}
                  alt={post.title}
                  style={{
                    objectFit: 'cover',
                    height: '200px', // Fixed height for uniformity
                    borderTopLeftRadius: '0.25rem',
                    borderTopRightRadius: '0.25rem'
                  }}
                />
                <Card.Body>
                  {/* Title of the post */}
                  <Card.Title>{post.title}</Card.Title>

                  {/* Truncated Description of the post */}
                  <Card.Text className="text-muted">
                    {truncateText(post.description, 100)}
                  </Card.Text>

                  {/* Truncated Content of the post */}
                  <Card.Text>
                    <strong>Content:</strong> <br />
                    {truncateText(post.content, 150)} {/* Truncated content */}
                  </Card.Text>

                  {/* Remove from favorites button */}
                  <Button
                    variant="danger"
                    onClick={() => removeFromFavorites(post.id)}
                    className="w-100"
                  >
                    Remove from Favorites
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center text-muted">You have no favorites yet.</p>
        )}
      </Row>
    </div>
  );
};

export default FavoritesPage;
