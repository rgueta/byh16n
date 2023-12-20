import { Router } from "express";
import * as pwdRSTCtrl from "../controllers/pwdRST.controller";
import { authJwt } from "../middleware";
const router = Router();

router.post('/:email',[authJwt.isNeighbor],pwdRSTCtrl.pwdRSTReq);
router.post('/test/:userId',[authJwt.isNeighbor],pwdRSTCtrl.pwdRSTReq);
router.post('/confirm/:id',pwdRSTCtrl.pwdRSTConfirm);
router.post('/apply/:id/:pwd/:repwd',pwdRSTCtrl.pwdRSTApply);

export default router;