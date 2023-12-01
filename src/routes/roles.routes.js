import { Router } from 'express'
import * as rolesCtrl from '../controllers/roles.controller';
import { authJwt } from '../middleware';
const router = Router();

router.post('/',[authJwt.verifyToken,authJwt.isAdmin],rolesCtrl.createRoles);
router.get('/',[authJwt.verifyToken,authJwt.isNeighbor],rolesCtrl.getRoles);

export default router;