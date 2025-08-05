import { Router } from "express";
import * as statesCtrl from "../controllers/states.controller";
import { authJwt, verifySignup } from "../middleware";

const router = Router();

router.post(
  "/",
  [authJwt.verifyToken, authJwt.isAdmin],
  statesCtrl.createState,
);
router.get(
  "/:country/:userId",
  [authJwt.verifyToken, authJwt.isNeighbor],
  statesCtrl.getStates,
);
router.get(
  "/:country/:stateId/:userId",
  [authJwt.verifyToken, authJwt.isNeighbor],
  statesCtrl.getState,
);
router.delete(
  "/:country/:stateId/:userId",
  [authJwt.verifyToken, authJwt.isAdmin],
  statesCtrl.deleteStateById,
);

export default router;
