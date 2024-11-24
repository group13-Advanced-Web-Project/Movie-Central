const API_URL = process.env.REACT_APP_API_URL;

export const submitReview = async (review) => {
  try {
    const response = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('auth0:id_token')}`,
      },
      body: JSON.stringify(review),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to submit review: ${errorMessage}`);
    }

    return await response.json(); // Return JSON response for further use
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error; // Allow caller to handle the error
  }
};
