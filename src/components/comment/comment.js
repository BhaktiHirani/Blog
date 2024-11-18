import React, { useState } from 'react';
import './CommentSection.css';

const CommentSection = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        text: newComment,
        date: new Date().toLocaleString(),
      };
      setComments([...comments, comment]);
      setNewComment("");
    }
  };

  return (
    <div className="comment-section-container">
      <h3>Comments</h3>
      <div className="comment-input-container">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="comment-input"
        />
        <button onClick={handleAddComment} className="post-button">
          Post
        </button>
      </div>
      <div className="comment-list">
        {comments.map((comment, index) => (
          <div key={index} className="comment-item">
            <p className="comment-text">{comment.text}</p>
            <span className="comment-date">{comment.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;