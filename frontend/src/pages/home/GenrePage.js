import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useFetchedMovies from '../useFetchedMovies';
import '../../styles/GenrePage.css';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const GenrePage = () => {
  const { genre } = useParams();
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

    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const filteredMovies = movies.filter(movie =>
    movie.genres?.toLowerCase().includes(genre.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMovies = filteredMovies.slice(startIndex, startIndex + itemsPerPage);

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
    <div className="home-container">
      {/* Navbar component */}
      <Navbar />

      <div className="genre-page-main">
        {/* Show loading spinner or content */}
        {loading ? (
          <div className="genre-page__loading">
            <p>Loading movies...</p>
          </div>
        ) : (
          <>
            <h2 className="genre-page__title">Movies in {genre} Genre</h2>
            {filteredMovies.length > 0 ? (
              <>
                <div className="genre-page__movie-grid">
                  {currentMovies.map(movie => (
                    <div className="genre-page__movie-tile" key={movie.id}>
                      <Link to={`/movie/${movie.title}`}>
                        <img
                          src={movie.imageUrl}
                          alt={movie.title}
                          className="genre-page__movie-poster"
                        />
                      </Link>
                      <h3 className="genre-page__movie-title">{movie.title}</h3>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="genre-page__pagination">
                  <button
                    className="genre-page__pagination-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>

                  {getPageButtons().map((page) => (
                    <button
                      key={page}
                      className={`genre-page__pagination-btn ${currentPage === page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    className="genre-page__pagination-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <p>No movies found for this genre.</p>
            )}
          </>
        )}
      </div>

      {/* Footer component */}
      <Footer />
    </div>
  );
};

export default GenrePage;
