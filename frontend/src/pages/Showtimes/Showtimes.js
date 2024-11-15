import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './fetchShowSchedule';
import '../../pages/Showtimes/UseMovies';
import '../../styles/Showtimes.css';

const theatreAreas = [
  { id: 1029, name: "All Regions" },
  { id: 1014, name: "Pääkaupunkiseutu" },
  { id: 1012, name: "Espoo" },
  { id: 1039, name: "Espoo: OMENA" },
  { id: 1038, name: "Espoo: SELLO" },
  { id: 1002, name: "Helsinki" },
  { id: 1045, name: "Helsinki: ITIS" },
  { id: 1031, name: "Helsinki: KINOPALATSI" },
  { id: 1032, name: "Helsinki: MAXIM" },
  { id: 1033, name: "Helsinki: TENNISPALATSI" },
  { id: 1013, name: "Vantaa: FLAMINGO" },
  { id: 1015, name: "Jyväskylä: FANTASIA" },
  { id: 1016, name: "Kuopio: SCALA" },
  { id: 1017, name: "Lahti: KUVAPALATSI" },
  { id: 1041, name: "Lappeenranta: STRAND" },
  { id: 1018, name: "Oulu: PLAZA" },
  { id: 1019, name: "Pori: PROMENADI" },
  { id: 1021, name: "Tampere" },
  { id: 1034, name: "Tampere: CINE ATLAS" },
  { id: 1035, name: "Tampere: PLEVNA" },
  { id: 1047, name: "Turku ja Raisio" },
  { id: 1022, name: "Turku: KINOPALATSI" },
  { id: 1046, name: "Raisio: LUXE MYLLY" }
];

function groupByMovieTheaterAuditorium(movies) {
  const groupedMovies = {};

  movies.forEach((movie) => {
    const { title, theatre, auditorium, presentationMethod, startTime } = movie;
    const formattedTime = new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (!groupedMovies[title]) {
      groupedMovies[title] = {};
    }

    if (!groupedMovies[title][theatre]) {
      groupedMovies[title][theatre] = {};
    }

    if (!groupedMovies[title][theatre][auditorium]) {
      groupedMovies[title][theatre][auditorium] = {
        presentationMethod,
        showtimes: []
      };
    }

    groupedMovies[title][theatre][auditorium].showtimes.push(formattedTime);
  });

  return groupedMovies;
}

function Showtimes({ movies, fetchShowSchedule }) {
  const [theatreArea, setTheatreArea] = useState(1029);
  const [movieTitle, setMovieTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Current date as default
  const [filteredMovies, setFilteredMovies] = useState({});

  useEffect(() => {
    const formattedDate = new Date(date).toLocaleDateString("fi-FI");
    fetchShowSchedule(formattedDate, theatreArea);
  }, [date, theatreArea]);

  useEffect(() => {
    const filtered = movies.filter((movie) =>
      movieTitle ? movie.title.toLowerCase().includes(movieTitle.toLowerCase()) : true
    );
    const grouped = groupByMovieTheaterAuditorium(filtered);
    setFilteredMovies(grouped);
  }, [movieTitle, movies]);

  return (
    <div>
      <Navbar />
      <div className="showtimes-content">
        <h1>Now Playing...</h1>

        <div className="showtimes-filter">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <select value={theatreArea} onChange={(e) => setTheatreArea(Number(e.target.value))}>
            {theatreAreas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search by Movie Title"
            value={movieTitle}
            onChange={(e) => setMovieTitle(e.target.value)}
          />
        </div>

        <div className="movie-list">
          {Object.keys(filteredMovies).length > 0 ? (
            Object.entries(filteredMovies).map(([title, theaters]) => {
              const movieData = movies.find(m => m.title === title);

              return (
                Object.entries(theaters).map(([theatre, auditoriums]) => {
                  // Find the theatre name based on the theatre id
                  const theatreName = theatreAreas.find(area => area.name === theatre)?.name || theatre;

                  return (
                    <div key={`${title}-${theatre}`} className="movie-card">
                      
                      {/* Display specific theatre area name on top of each movie card */}
                      <p className="theater-area-top">{theatreName}</p>

                      <div className="image-container">
                        {movieData && movieData.imageUrl ? (
                          <img src={movieData.imageUrl} alt={title} className="image-card" />
                        ) : (
                          <div className="image-placeholder">Image Not Available</div>
                        )}
                      </div>

                      <div className="movie-info">
                        <h3 className="movie-title">
                          {title} {movieData && movieData.presentationMethod && `(${movieData.presentationMethod})`}
                        </h3>

                        <div className="showtimes-list">
                          {Object.entries(auditoriums).map(([auditorium, { presentationMethod, showtimes }], index) => (
                            <p key={index} className="showtime-item">
                              {showtimes.map(time => (
                                <span key={time} className="time-slot">
                                  {time} <span className="auditorium-info">({auditorium})</span>
                                  {presentationMethod === "Dolby Atmos" && (
                                    <span className="presentation-method">Dolby Atmos</span>
                                  )}
                                </span>
                              ))}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              );
            })
          ) : (
            <p className="no-movies-message">No movies available for the selected filters.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Showtimes;
