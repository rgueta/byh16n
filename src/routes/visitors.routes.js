import {Router} from 'express'
import * as visitorCtrl from '../controllers/visitors.controller';
import { authJwt, verifySignup } from "../middleware";
const router = Router();

router.post('/',[authJwt.verifyToken,authJwt.isNeighbor],visitorCtrl.createVisitor);
router.get('/',visitorCtrl.getVisitors);
router.get('/user/:userId',visitorCtrl.getVisitorsByUser);
router.get('/:visitorId',visitorCtrl.getVisitorById);
router.put('/:visitorId',[authJwt.verifyToken,authJwt.isAdmin,authJwt.isNeighbor],visitorCtrl.updateVisitorById);
// router.put('/simple/:visitorId/',[authJwt.verifyToken,authJwt.isNeighbor],
//     visitorCtrl.updateSimpleVisitorById);
router.put('/simple/:userId/:visitorId',[authJwt.verifyToken,authJwt.isNeighbor],visitorCtrl.updateSimpleVisitorById);
router.delete('/:visitorId',[authJwt.verifyToken,authJwt.isAdmin],visitorCtrl.deleteVisitorById);

export default router;