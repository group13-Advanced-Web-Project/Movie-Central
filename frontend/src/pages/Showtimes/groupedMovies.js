export const groupByMovieTheaterAuditorium = (movies) => {
  const groupedMovies = {};

  movies.forEach((movie) => {
    const { title, theatre, auditorium, presentationMethod, language, startTime } = movie;
    const formattedTime = new Date(startTime).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (!groupedMovies[theatre]) {
      groupedMovies[theatre] = {};
    }

    if (!groupedMovies[theatre][title]) {
      groupedMovies[theatre][title] = [];
    }

    const existingAuditorium = groupedMovies[theatre][title].find(
      (entry) => entry.auditorium === auditorium
    );

    if (existingAuditorium) {
      existingAuditorium.showtimes.push(formattedTime);
    } else {
      groupedMovies[theatre][title].push({
        auditorium,
        presentationMethod,
        language,
        showtimes: [formattedTime],
      });
    }
  });

  return groupedMovies;
};
