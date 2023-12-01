import { Router } from 'express';
import * as coresCtrl from '../controllers/cores.controller';
import { authJwt, verifySignup } from "../middleware";

const router = Router();

router.post('/:userId',[authJwt.verifyToken,authJwt.isNeighbor],coresCtrl.createCore);
router.post('/chgSim/:userId',[authJwt.verifyToken,authJwt.isAdmin],coresCtrl.chgSim);
router.post('/enable/:userId',[authJwt.verifyToken,authJwt.isAdmin],coresCtrl.enableCore);
router.post('/disable/:userId',[authJwt.verifyToken,authJwt.isAdmin],coresCtrl.disableCore);

router.get('/admin/:userId',[authJwt.verifyToken,authJwt.isAdmin],coresCtrl.getCoresAdmin);
router.get('/:country,:state,:city,:division,:cpu',
    [authJwt.verifyToken,authJwt.isNeighbor],coresCtrl.getCores);
router.get('/light/:country,:state,:city,:division,:cpu',
    [authJwt.verifyToken,authJwt.isNeighbor],coresCtrl.getCoresLight);



router.delete('/:coreId',[authJwt.verifyToken,authJwt.isAdmin],coresCtrl.deleteCoreById);

export default router;