import FeaturedMovie from '../../components/home/FeaturedMovie';
import MovieCarousel from '../../components/home/MovieCarousel';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useMovies } from '../../context/MoviesContext';
import '../../styles/Home.css';

function Home() {
  const { movies, loading, error } = useMovies(); 

  return (
    <div className="home-container">
      <Navbar />
      <div className="home-main-content">
        {loading ? (
          <p>Loading movies...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
            <FeaturedMovie className="home-featured-movie" movies={movies} />
            <MovieCarousel movies={movies} />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Home;
