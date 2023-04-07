import {Router} from 'express'
import * as codesCtrl from '../controllers/codes.controller';
import {authJwt}  from "../middleware";
const router = Router();

router.post('/:userId',[authJwt.verifyToken,authJwt.isNeighbor],codesCtrl.createCode );

router.get('/',[authJwt.verifyToken,authJwt.isNeighbor],codesCtrl.getCodes);

router.get('/user/:userId',[authJwt.verifyToken,authJwt.isNeighbor],codesCtrl.getCodesByUser);

// router.get('/user/:userId',codesCtrl.getCodesByUser);

// router.get('/user/:userId',codesCtrl.getCodesByUser);
router.get('/:codeId',codesCtrl.getCodeById);
// router.put('/update/:codeId',codesCtrl.updateCodeById);
router.put('/update/:userId/:codeId',[authJwt.verifyToken,authJwt.isNeighbor],codesCtrl.updateCodeById);
router.delete('/:codeId',[authJwt.verifyToken,authJwt.isAdmin],codesCtrl.deleteCodeById);

export default router;