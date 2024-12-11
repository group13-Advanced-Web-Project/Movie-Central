import React from 'react';
import '../../styles/Showtimes.css';

const Pagination = ({ currentPage, totalPages, goToPreviousPage, goToPage, goToNextPage }) => {
  return (
    <div className="pagination-container">
      <div className="pagination-row upper-row">
        <button
          className="pagination-button"
        disabled={currentPage === 1}
          onClick={goToPreviousPage}
        >
          Previous
        </button>
      </div>

      <div className="pagination-row middle-row">
        {[...Array(totalPages).keys()].map((page) => (
          <button
            key={page + 1}
            className={`pagination-number ${currentPage === page + 1 ? 'active' : ''}`}
            onClick={() => goToPage(page + 1)}
          >
            {page + 1}
          </button>
        ))}
      </div>

      <div className="pagination-row lower-row">
        <button
          className="pagination-button"
          disabled={currentPage === totalPages}
          onClick={goToNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
