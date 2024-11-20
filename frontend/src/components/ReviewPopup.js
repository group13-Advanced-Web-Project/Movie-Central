import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react'; // Import Auth0 hook
import '../styles/ReviewPopup.css'; // Include styles for the popup

const ReviewPopup = ({ movieId, onClose, onSubmit }) => {
  const { user } = useAuth0(); // Use Auth0 to get the user's details
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);

  const handleRatingClick = (star) => {
    setRating(star);
  };

  const handleSubmit = async () => {
    if (description && rating && user?.sub) { // Ensure user.sub (auth0Id) is available
      const review = {
        movieId,
        description,
        rating,
        user_id: user.sub, // Include auth0Id from Auth0
        timestamp: new Date().toISOString(),
      };

      // Call the onSubmit prop with the review object
      await onSubmit(review);
      onClose();
    } else {
      alert('Please provide a description, rating, and make sure you are logged in.');
    }
  };

  return (
    <div className="review-popup">
      <div className="review-popup-content">
        <h2>Give a Review</h2>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter your review here..."
        />
        <div className="rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={star <= rating ? 'star selected' : 'star'}
              onClick={() => handleRatingClick(star)}
            >
              ★
            </span>
          ))}
        </div>
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={onClose} className="close-btn">
          Close
        </button>
      </div>
    </div>
  );
};

export default ReviewPopup;
