import {Router} from 'express'
import * as visitorCtrl from '../controllers/visitors.controller';
import { authJwt, verifySignup } from "../middleware";
const router = Router();

router.post('/:userId',[authJwt.verifyToken,authJwt.isNeighbor],visitorCtrl.createVisitor);
router.get('/',[authJwt.verifyToken,authJwt.isNeighbor],visitorCtrl.getVisitors);
router.get('/user/:userId',[authJwt.verifyToken,authJwt.isNeighbor],visitorCtrl.getVisitorsByUser);
router.get('/:visitorId',[authJwt.verifyToken,authJwt.isNeighbor],visitorCtrl.getVisitorById);
router.put('/:visitorId',[authJwt.verifyToken,authJwt.isNeighbor],visitorCtrl.updateVisitorById);
router.put('/simple/:userId/:visitorId',[authJwt.verifyToken,authJwt.isNeighbor],visitorCtrl.updateSimpleVisitorById);
router.delete('/:visitorId',[authJwt.verifyToken,authJwt.isAdmin],visitorCtrl.deleteVisitorById);

export default router;