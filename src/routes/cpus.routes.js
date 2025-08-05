import { Router } from "express";
import * as cpusCtrl from "../controllers/cpus.controller";
import { authJwt, verifySignup } from "../middleware";

const router = Router();

router.post(
  "/:countyId/:stateId/:cityId/:userId",
  [authJwt.verifyToken, authJwt.isAdmin],
  cpusCtrl.createCpu,
);
router.get("/", cpusCtrl.getCpu);
router.get(
  "/full/:country/:state/:city/:division/:userId",
  [authJwt.verifyToken, authJwt.isNeighbor],
  cpusCtrl.getCpusFull,
);
router.get(
  "/basic/:country/:state/:city/:division/:userId",
  [authJwt.verifyToken, authJwt.isNeighbor],
  cpusCtrl.getCpusBasic,
);
router.put(
  "/updCpu/:userId",
  [authJwt.verifyToken, authJwt.isAdmin],
  cpusCtrl.updateCpu,
);
router.delete(
  "/:country/:state/:city/:division/:userId",
  [authJwt.verifyToken, authJwt.isAdmin],
  cpusCtrl.deleteCpuById,
);

export default router;
