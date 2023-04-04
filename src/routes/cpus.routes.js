import { Router } from 'express';
import * as cpusCtrl from '../controllers/cpus.controller';
import { authJwt, verifySignup } from "../middleware";

const router = Router();

router.post('/:countyId:stateId:cityId',[authJwt.verifyToken,authJwt.isAdmin],cpusCtrl.createCpu);
router.get('/full/:country,:state,:city,:division',[authJwt.verifyToken],cpusCtrl.getCpusFull);
router.get('/basic/:country,:state,:city,:division',[authJwt.verifyToken],cpusCtrl.getCpusBasic);
router.delete('/:country,:state,:city,:division',[authJwt.verifyToken,authJwt.isAdmin],cpusCtrl.deleteCpuById);

export default router;