import React from 'react';
import FeaturedMovie from '../../components/home/FeaturedMovie';
import MovieCarousel from '../../components/home/MovieCarousel';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import '../../styles/Home.css'; 

function Home({ movies }) {
  return (
    <div className="home-container">
      <Navbar />
      <div className="home-main-content">
        <FeaturedMovie className="home-featured-movie" movies={movies} />
        <MovieCarousel movies={movies} />
      </div>
      <Footer />
    </div>
  );
}

export default Home;
