import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar'; 
import Footer from '../../components/Footer'; 
import ShowtimeCard from './ShowtimeCard';
import Pagination from './Pagination';
import { groupByMovieTheaterAuditorium } from './groupedMovies';
import '../../styles/Showtimes.css';

// Theater Area List
const theaterAreas = [
  { id: 1029, name: 'Valitse alue/teatteri' },
  { id: 1014, name: 'Pääkaupunkiseutu' },
  { id: 1012, name: 'Espoo' },
  { id: 1039, name: 'Espoo: OMENA' },
  { id: 1038, name: 'Espoo: SELLO' },
  { id: 1002, name: 'Helsinki' },
  { id: 1045, name: 'Helsinki: ITIS' },
  { id: 1031, name: 'Helsinki: KINOPALATSI' },
  { id: 1032, name: 'Helsinki: MAXIM' },
  { id: 1033, name: 'Helsinki: TENNISPALATSI' },
  { id: 1013, name: 'Vantaa: FLAMINGO' },
  { id: 1015, name: 'Jyväskylä: FANTASIA' },
  { id: 1016, name: 'Kuopio: SCALA' },
  { id: 1017, name: 'Lahti: KUVAPALATSI' },
  { id: 1041, name: 'Lappeenranta: STRAND' },
  { id: 1018, name: 'Oulu: PLAZA' },
  { id: 1019, name: 'Pori: PROMENADI' },
  { id: 1021, name: 'Tampere' },
  { id: 1034, name: 'Tampere: CINE ATLAS' },
  { id: 1035, name: 'Tampere: PLEVNA' },
  { id: 1047, name: 'Turku ja Raisio' },
  { id: 1022, name: 'Turku: KINOPALATSI' },
  { id: 1046, name: 'Raisio: LUXE MYLLY' },
];

const Showtimes = ({ movies, fetchShowSchedule }) => {
  const [theatreArea, setTheatreArea] = useState(1029);
  const [movieTitle, setMovieTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [flatMovieList, setFlatMovieList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const moviesPerPage = 24;

  useEffect(() => {
    const selectedDate = new Date(date).toLocaleDateString('fi-FI');
    fetchShowSchedule(selectedDate, theatreArea); // Fetch showtimes based on date and area
  }, [date, theatreArea, fetchShowSchedule]);

  useEffect(() => {
    const filteredMovies = movies.filter((movie) =>
      movieTitle ? movie.title.toLowerCase().includes(movieTitle.toLowerCase()) : true
    );
  
    const groupedMovies = groupByMovieTheaterAuditorium(filteredMovies);
  
    const movieList = [];
  
    for (let theaterName in groupedMovies) {
      const moviesInTheater = groupedMovies[theaterName];
  
      for (let movieTitle in moviesInTheater) {
        const auditoriums = moviesInTheater[movieTitle];
  
        movieList.push({
          theater: theaterName, // Pass theater name here
          title: movieTitle,
          imageUrl: movies.find((m) => m.title === movieTitle)?.imageUrl || null,
          auditoriums,
        });
      }
    }
  
    setFlatMovieList(movieList); // Update the movie list
  }, [movies, movieTitle]);
  

  useEffect(() => {
    setCurrentPage(1); // Reset to the first page when filters change
  }, [date, theatreArea, movieTitle]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= Math.ceil(flatMovieList.length / moviesPerPage)) {
      setCurrentPage(pageNumber);
    }
  };

  const paginatedMovies = flatMovieList.slice(
    (currentPage - 1) * moviesPerPage,
    currentPage * moviesPerPage
  );

  return (
  <div>
    <Navbar/>
    <div className="showtimes-container">
      <h1 className="now-playing-heading">Now Playing...</h1>

      <div className="showtimes-filter">
        <input
          type="date"
          className="filter-item"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <select
          className="filter-item"
          value={theatreArea}
          onChange={(e) => setTheatreArea(Number(e.target.value))}
        >
          {theaterAreas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          className="filter-item"
          placeholder="Search by Movie Title"
          value={movieTitle}
          onChange={(e) => setMovieTitle(e.target.value)}
        />
      </div>

      <div className="movie-list">
        {paginatedMovies.length > 0 ? (
          paginatedMovies.map((movie, index) => (
            <ShowtimeCard key={`${movie.theater}-${movie.title}-${index}`} movie={movie} />
          ))
        ) : (
          <p>No movies available for the selected filters.</p>
        )}
      </div>

      {flatMovieList.length > moviesPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(flatMovieList.length / moviesPerPage)}
          onPageChange={handlePageChange}
        />
      )}
    </div>
    <Footer/>
  </div>
  );
};



export default Showtimes;
