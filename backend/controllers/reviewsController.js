import * as reviewsModel from "../models/reviewsModel.js";

// Mask email
const maskEmail = (email) => {
    if (!email.includes("@")) return email;
    const [username, domain] = email.split("@");
    const maskedUsername = `${username.slice(0, 3)}***${username.slice(-2)}`;
    return `${maskedUsername}@${domain}`;
};

// Get all reviews
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await reviewsModel.getAllReviews();

        const sanitizedReviews = reviews.map((review) => ({
            ...review,
            user_email: maskEmail(review.user_email),
        }));

        res.json(sanitizedReviews);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch reviews", details: error.message });
    }
};

// Add a new review
export const addReview = async (req, res) => {
    const { movie_id, user_id, description, rating, user_email } = req.body;

    if (!movie_id || !user_id || !description || !rating || !user_email) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const existingReview = await reviewsModel.getReviewsByMovieId(movie_id);
        
        if (existingReview.some((review) => review.user_id === user_id)) {
            return res.status(400).json({ error: "User has already given a review to this movie" });
        }

        const movie_name = await reviewsModel.fetchMovieNameFromTMDB(movie_id);
        
        const newReview = await reviewsModel.addReview(
            movie_id,
            movie_name,
            user_id,
            user_email,
            description,
            rating
        );
        res.json(newReview);
    } catch (error) {
        res.status(500).json({ error: "Failed to add review", details: error.message });
    }
};

// Delete a review
export const deleteReview = async (req, res) => {
    const { review_id } = req.params;

    try {
        const deletedReview = await reviewsModel.deleteReview(review_id);
        
        if (!deletedReview) {
            return res.status(404).json({ error: "Review not found" });
        }

        res.json(deletedReview);
    } catch (error) {
        res.status(500).json({ error: "Failed to delete review", details: error.message });
    }
};

// Update a review
export const updateReview = async (req, res) => {
    const { review_id } = req.params;
    const { description, rating } = req.body;

    if (!description && !rating) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const updatedReview = await reviewsModel.updateReview(review_id, description, rating);

        if (!updatedReview) {
            return res.status(404).json({ error: "Review not found" });
        }

        res.json(updatedReview);
    } catch (error) {
        res.status(500).json({ error: "Failed to update review", details: error.message });
    }
};

// Get reviews by movie_id
export const getReviewsByMovieId = async (req, res) => {
    const { movie_id } = req.params;

    try {
        const reviews = await reviewsModel.getReviewsByMovieId(movie_id);
        const sanitizedReviews = reviews.map((review) => ({
            ...review,
            user_email: maskEmail(review.user_email),
        }));
        res.json(sanitizedReviews);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch reviews", details: error.message });
    }
};

// Get reviews by user_id
export const getReviewsByUserId = async (req, res) => {
    const { user_id } = req.params;

    try {
        const reviews = await reviewsModel.getReviewsByUserId(user_id);
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch reviews", details: error.message });
    }
};
