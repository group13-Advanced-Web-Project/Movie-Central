import React from 'react';
import Feed1 from './Feed1';
import Feed2 from './Feed2';
import Navbar from './Navbar';
import Footer from './Footer';

function Home({ movies }) {
  return (
    <div>
      <Navbar />
      <div className="main-content">
        <Feed1 movies={movies} />
        <Feed2 movies={movies} />
      </div>
      <Footer />
    </div>
  );
}

export default Home;
