import { Router } from "express";
import * as pwdRSTCtrl from "../controllers/pwdRST.controller";
import { authJwt } from "../middleware";
const router = Router();

router.post('/:email',pwdRSTCtrl.pwdRSTReq);
router.post('/confirm/:id',pwdRSTCtrl.pwdRSTConfirm);
router.post('/apply/:id/:pwd',pwdRSTCtrl.pwdRSTApply);
router.post('/verify/:id',pwdRSTCtrl.pwdRSTVerify);

export default router;