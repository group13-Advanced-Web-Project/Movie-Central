import React from 'react';
import FeaturedMovie from '../../components/home/FeaturedMovie';
import MovieCarousel from '../../components/home/MovieCarousel';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

function Home({ movies }) {
  return (
    <div>
      <Navbar />
      <div className="main-content">
        <FeaturedMovie movies={movies} />
        <MovieCarousel movies={movies} />
      </div>
      <Footer />
    </div>
  );
}

export default Home;
