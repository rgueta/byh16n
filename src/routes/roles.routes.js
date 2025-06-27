import { Router } from 'express'
import * as rolesCtrl from '../controllers/roles.controller';
import { authJwt } from '../middleware';
const router = Router();

router.post('/',[authJwt.verifyToken,authJwt.isAdmin],rolesCtrl.createRoles);

// router.get('/:userId',[authJwt.verifyToken,authJwt.isNeighborAdmin],rolesCtrl.getRoles);
router.get('/:userId',rolesCtrl.getRoles);

router.get('/neiAdmin/:userId',[authJwt.verifyToken,authJwt.isNeighborAdmin],rolesCtrl.getRolesNeiAdmin);

export default router;