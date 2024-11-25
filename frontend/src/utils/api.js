const serverUrl = process.env.REACT_APP_API_URL;

// Submit a review
export const submitReview = async (review) => {
    try {
        const response = await fetch(`${serverUrl}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(review),
        });

        if (!response.ok) {
            throw new Error('Failed to submit review');
        }

        return await response.json();
    } catch (error) {
        console.error('Error submitting review:', error.message);
        throw error;
    }
};


// Fetch reviews by movie_id
export const fetchReviews = async (movie_id) => {
    try {
        const response = await fetch(`${serverUrl}/reviews/movie/${movie_id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch reviews');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching reviews:', error.message);
        throw error;
    }
};


// Fetch all reviews
export const getAllReviews = async () => {
    try {
        const response = await fetch(`${serverUrl}/reviews`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch all reviews');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching all reviews:', error.message);
        throw error;
    }
};
