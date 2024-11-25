import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/ReviewPage.css'; 

const ReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2); 

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/reviews`);
        // Sort reviews by timestamp in descending order
        const sortedReviews = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setReviews(sortedReviews);
      } catch (error) {
        console.error("Failed to fetch reviews:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const totalPages = Math.ceil(reviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReviews = reviews.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageButtons = () => {
    const pageButtons = [];
    const visiblePages = 3;

    if (totalPages <= visiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageButtons.push(i);
      }
    } else {
      if (currentPage <= 2) {
        pageButtons.push(1, 2, 3);
      } else if (currentPage >= totalPages - 1) {
        pageButtons.push(totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageButtons.push(currentPage - 1, currentPage, currentPage + 1);
      }
    }

    return pageButtons;
  };

  return (
    <div className="review-page-container">
      <Navbar />

      <div className="review-page-main">
        {loading ? (
          <div className="review-page__loading">
            <p>Loading reviews...</p>
          </div>
        ) : (
          <>
            <h2 className="review-page__title">All Reviews</h2>
            {reviews.length > 0 ? (
              <>
                <div className="review-page__review-container">
                  {currentReviews.map((review) => (
                    <div className="review-page__review-item" key={review.review_id}>
                      <h3 className="review-page__movie-title">
                        <Link
                          to={`/movie/${encodeURIComponent(review.movie_name)}`}
                          className="review-page__movie-link"
                        >
                          {review.movie_name}
                        </Link>
                      </h3>
                      <p>{review.description}</p>
                      <p>Rating: {review.rating}</p>
                      <p>Reviewed on: {new Date(review.timestamp).toLocaleDateString()}</p>
                      <p>
                        Reviewer Email:{" "}
                        {review.user_email.replace(/(.{3})(.*)(?=@)/, "$1****$3")}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="review-page__pagination">
                  <button
                    className="review-page__pagination-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>

                  {getPageButtons().map((page) => (
                    <button
                      key={page}
                      className={`review-page__pagination-btn ${
                        currentPage === page ? "active" : ""
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    className="review-page__pagination-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <p>No reviews found.</p>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ReviewPage;
