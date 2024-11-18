// components/bookmark/BookmarkPage.js
import React from 'react';
import { useBookmarks } from './BookmarkContext'; // Import the custom hook
import { Card, Button, Row, Col } from 'react-bootstrap'; // Import necessary components from Bootstrap

const BookmarkPage = () => {
  const { bookmarks, removeFromBookmarks } = useBookmarks(); // Access context values

  // Make sure bookmarks is always an array
  const validBookmarks = Array.isArray(bookmarks) ? bookmarks : []; // Default to an empty array if it's not an array

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Bookmarks</h2>

      {/* Check if there are any valid bookmarks */}
      {validBookmarks.length > 0 ? (
        <Row>
          {validBookmarks.map((post) => (
            <Col key={post.id} md={4} sm={6} className="mb-4">
              <Card className="shadow-sm">
                {/* Image of the post */}
                <Card.Img
                  variant="top"
                  src={post.image || '/assets/images/food/placeholder.jpg'} // Fallback to placeholder
                  alt={post.title}
                  style={{ objectFit: 'cover', height: '200px' }}
                />
                <Card.Body>
                  {/* Title of the post */}
                  <Card.Title>{post.title}</Card.Title>

                  {/* Truncated Description of the post */}
                  <Card.Text className="text-muted">
                    {post.description}
                  </Card.Text>

                  {/* Content of the post */}
                  <Card.Text>
                    <strong>Content:</strong> <br />
                    {post.content}
                  </Card.Text>

                  {/* Remove from bookmarks button */}
                  <Button variant="danger" onClick={() => removeFromBookmarks(post.id)} className="w-100">
                    Remove from Bookmarks
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p>No bookmarks yet!</p>
      )}
    </div>
  );
};

export default BookmarkPage;
