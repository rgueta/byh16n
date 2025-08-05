import { Router } from "express";
import * as codesCtrl from "../controllers/codes.controller";
import { authJwt } from "../middleware";
import { isNeighbor } from "../middleware/authjwt";
const router = Router();

router.post(
  "/:userId",
  [authJwt.verifyToken, authJwt.isNeighbor],
  codesCtrl.createCode,
);
router.get(
  "/:userId",
  [authJwt.verifyToken, authJwt.isNeighbor],
  codesCtrl.getCodes,
);

router.get(
  "/user/:userId",
  [authJwt.verifyToken, authJwt.isNeighbor],
  codesCtrl.getCodesByUser,
);

router.get(
  "/:codeId",
  [authJwt.verifyToken, authJwt.isNeighbor],
  codesCtrl.getCodeById,
);
router.get("/visitors_dashboard/:userId", codesCtrl.getVisitors_dashboard);
router.get(
  "/activeCode/:code/:userId/:doorName",
  [authJwt.isNeighbor],
  codesCtrl.expirationCode,
);

router.put(
  "/update/:userId/:codeId",
  [authJwt.verifyToken, authJwt.isAdmin],
  codesCtrl.updateCodeById,
);
router.delete(
  "/:codeId",
  [authJwt.verifyToken, authJwt.isAdmin],
  codesCtrl.deleteCodeById,
);

export default router;
