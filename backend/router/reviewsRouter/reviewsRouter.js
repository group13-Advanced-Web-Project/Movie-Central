import { Router } from "express";
import * as reviewsController from "../../controllers/reviewsController.js";
 
const router = Router();

router.get("/", reviewsController.getAllReviews);
router.post("/", reviewsController.addReview);
router.get("/movie/:movie_id", reviewsController.getReviewsByMovieId);

export default router;