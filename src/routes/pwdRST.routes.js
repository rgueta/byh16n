import { Router } from "express";
import * as pwdRSTCtrl from "../controllers/pwdRST.controller";
const router = Router();

router.post('/:email',pwdRSTCtrl.pwdRSTReq);
router.post('/confirm/:id',pwdRSTCtrl.pwdRSTConfirm);
router.post('/apply/:id/:pwd/:repwd',pwdRSTCtrl.pwdRSTApply);

export default router;