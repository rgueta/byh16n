import { Router } from "express";
import * as twilioCtrl from "../controllers/twilio.controller";
import { authJwt } from "../middleware";
const router = Router();

router.post('/open/:userId/:msg/:phone',[authJwt.verifyToken,authJwt.isNeighbor],twilioCtrl.sendMsgOpen);
router.post('/access/:userId/:msg/:phone',[authJwt.verifyToken,authJwt.isAdmin],twilioCtrl.sendMsgAccess);
// router.post('/code/:userId/:msg/:phone',[authJwt.isNeighbor],twilioCtrl.sendMsg);

export default router;