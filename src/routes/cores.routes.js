import { Router } from 'express';
import * as coresCtrl from '../controllers/cores.controller';
import { authJwt, verifySignup } from "../middleware";

const router = Router();

router.post('/',[authJwt.verifyToken,authJwt.isAdmin],coresCtrl.createCore);
router.get('/',coresCtrl.getCores);
router.get('/onlyCores',coresCtrl.getOnlyCores);
router.delete('/:coreId',[authJwt.verifyToken,authJwt.isAdmin],coresCtrl.deleteCoreById);

export default router;