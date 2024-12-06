import { Router } from "express";
import * as GroupController from "../../controllers/groupController.js";

const router = Router();

router.get("/", GroupController.getGroups);
router.post("/", GroupController.createGroup);
router.get("/:group_id", GroupController.getGroupById);
router.post("/join", GroupController.joinGroup);
router.get('/users/:user_id', GroupController.getAllUserGroups);
router.delete('/:group_id/members/:user_id', GroupController.leaveGroup);
router.get('/:group_id/members', GroupController.getGroupMembers);
router.get('/:group_id/requests', GroupController.getPendingRequests);
router.post('/:group_id/update-request', GroupController.updateRequestStatus);
router.get('/status/:group_id/:user_id', GroupController.getJoinRequestStatus);
router.post('/:group_id/admin', GroupController.assignNewAdmin);
router.delete('/:group_id', GroupController.deleteGroup);
router.post('/:group_id/movies', GroupController.addMovieToGroup);
router.get('/:group_id/movies', GroupController.getMoviesForGroup);

export default router;