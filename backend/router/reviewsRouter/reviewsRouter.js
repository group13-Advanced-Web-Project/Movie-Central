import { Router } from "express";
import * as reviewsController from "../../controllers/reviewsController.js";
 
const router = Router();

router.get("/", reviewsController.getAllReviews);
router.post("/", reviewsController.addReview);
router.delete("/:review_id", reviewsController.deleteReview);
router.put("/:review_id", reviewsController.updateReview);
router.get("/movie/:movie_id", reviewsController.getReviewsByMovieId);
router.get("/user/:user_id", reviewsController.getReviewsByUserId);

export default router;