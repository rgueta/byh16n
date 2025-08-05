import { Router } from "express";
import * as citiesCtrl from "../controllers/cities.controller";
import { authJwt } from "../middleware";

const router = Router();

router.post(
  "/:county/:state/:userId",
  [authJwt.verifyToken, authJwt.isAdmin],
  citiesCtrl.createCity,
);
router.get(
  "/:country/:state/:userId",
  [authJwt.verifyToken, authJwt.isNeighbor],
  citiesCtrl.getCities,
);
router.delete(
  "/:country/:state/:city/userId",
  [authJwt.verifyToken, authJwt.isAdmin],
  citiesCtrl.deleteCityById,
);

export default router;
