import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import useFetchedMovies from '../useFetchedMovies'; 
import '../../styles/YearPage.css'; 

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const YearPage = () => {
  const { year } = useParams();
  const { movies, loading } = useFetchedMovies();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8); 

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 600) {
        setItemsPerPage(6); 
      } else if (window.innerWidth < 900) {
        setItemsPerPage(10); 
      } else {
        setItemsPerPage(14); 
      }
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);

    // Clean up event listener on component unmount
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const filteredMovies = movies.filter(movie => movie.year?.toString() === year);

  // Pagination logic
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMovies = filteredMovies.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle showing a limited number of page buttons for small screens
  const getPageButtons = () => {
    const pageButtons = [];
    const visiblePages = 3; // Number of pages to show for small screens

    if (totalPages <= visiblePages) {
      // Show all page buttons if there are fewer total pages
      for (let i = 1; i <= totalPages; i++) {
        pageButtons.push(i);
      }
    } else {
      // For more pages, only show the current, previous, and next set
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
    <div className="home-container">
      {/* Navbar component */}
      <Navbar />
      <div className="year-page-main">
      {/* Show loading spinner or content */}
      {loading ? (
        <div className="year-page__loading">
          <p>Loading movies...</p>
        </div>
      ) : (
        <>
          <h2 className="year-page__title">Movies Released in {year}</h2>
          {filteredMovies.length > 0 ? (
            <>
              <div className="year-page__movie-grid">
                {currentMovies.map(movie => (
                  <div className="year-page__movie-tile" key={movie.id}>
                    <Link to={`/movie/${movie.title}`}>
                      <img
                        src={movie.imageUrl}
                        alt={movie.title}
                        className="year-page__movie-poster"
                      />
                    </Link>
                    <h3 className="year-page__movie-title">{movie.title}</h3>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="year-page__pagination">
                <button
                  className="year-page__pagination-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                {getPageButtons().map((page) => (
                  <button
                    key={page}
                    className={`year-page__pagination-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  className="year-page__pagination-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <p>No movies found for this year.</p>
          )}
        </>
      )}
      </div>
      {/* Footer component */}
      <Footer />
    </div>
  );
};

export default YearPage;
