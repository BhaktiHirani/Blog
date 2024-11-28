import React from 'react';
import { FaHeart } from 'react-icons/fa';
import { useFavorites } from '../../components/favourite/FavoritesContext';
import { Card, Button, Row, Col, Spinner } from 'react-bootstrap';
import './favourite.css';

const FavoritesPage = () => {
  const { favorites, removeFromFavorites, isLoading, error } = useFavorites();

  const truncateText = (text, limit) => {
    if (!text) return '';
    return text.length > limit ? `${text.substring(0, limit)}...` : text;
  };

  if (isLoading) {
    return (
      <div className="container text-center mt-4">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center mt-4">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

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
                <Card.Img
                  variant="top"
                  src={post.image || '/assets/images/food/placeholder.jpg'}
                  alt={post.title}
                  style={{
                    objectFit: 'cover',
                    height: '200px',
                    borderTopLeftRadius: '0.25rem',
                    borderTopRightRadius: '0.25rem',
                  }}
                />
                <Card.Body>
                  <Card.Title>{post.title}</Card.Title>
                  <Card.Text className="text-muted">
                    {truncateText(post.description, 100)}
                  </Card.Text>
                  <Card.Text>
                    <strong>Content:</strong> <br />
                    {truncateText(post.content, 150)}
                  </Card.Text>

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
