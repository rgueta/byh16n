import { Router } from 'express';
import * as coresCtrl from '../controllers/cores.controller';
import { authJwt, verifySignup } from "../middleware";

const router = Router();

// router.post('/',[authJwt.verifyToken],coresCtrl.createCore);
router.post('/:userId',[authJwt.verifyToken,authJwt.isNeighbor],coresCtrl.createCore);
// router.post('/',[authJwt.verifyToken,authJwt.isAdmin],coresCtrl.createCore);



// router.post('/enable/',[authJwt.verifyToken,authJwt.isAdmin],coresCtrl.enableCore);
router.post('/enable/',coresCtrl.enableCore);
// router.post('/disable/',[authJwt.verifyToken,authJwt.isAdmin],coresCtrl.disableCore);
router.post('/disable/',coresCtrl.disableCore);

router.get('/admin/:userId',coresCtrl.getCoresAdmin);
// router.get('/admin/:userId',[authJwt.verifyToken, authJwt.isAdmin],coresCtrl.getCoresAdmin);

router.get('/:country,:state,:city,:division,:cpu',coresCtrl.getCores);
router.get('/light/:country,:state,:city,:division,:cpu',coresCtrl.getCoresLight);
router.delete('/:coreId',[authJwt.verifyToken,authJwt.isAdmin],coresCtrl.deleteCoreById);

export default router;