import { Router } from 'express';
import * as statesCtrl from '../controllers/states.controller';
import { authJwt, verifySignup } from "../middleware";

const router = Router();

router.post('/',[authJwt.verifyToken,authJwt.isAdmin],statesCtrl.createState);
router.get('/:country',statesCtrl.getStates);
router.get('/:country/:stateId',statesCtrl.getState);
router.delete('/:country/:stateId',[authJwt.verifyToken,authJwt.isAdmin],statesCtrl.deleteStateById);

export default router;