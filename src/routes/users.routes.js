import {Router} from 'express'
import * as usersCtrl from '../controllers/users.controller';
import { authJwt, verifySignup } from "../middleware";
const router = Router();

router.post('/user',[authJwt.verifyToken,authJwt.isAdmin],usersCtrl.createUser);
router.post('/new/:userId',usersCtrl.newUser);
router.post('/user/:userId',[authJwt.verifyToken,authJwt.isAdmin],usersCtrl.createUser);
router.post('/register/',usersCtrl.RegisterUser);
router.post('/lock/:userId/:neighborId',[authJwt.verifyToken,authJwt.isAdmin],usersCtrl.lockUser);
router.post('/unlock/:userId/:neighborId',[authJwt.verifyToken,authJwt.isAdmin],usersCtrl.unlockUser);
router.post('/updroles/:userId',[authJwt.verifyToken,authJwt.isAdmin],usersCtrl.updRoles);
router.post('/updSim/:userId',[authJwt.verifyToken,authJwt.isNeighborAdmin],usersCtrl.updSim);

router.get('/',usersCtrl.getUsers);
router.get('/user/:userId',usersCtrl.getUserById);
router.get('/core/:coreId/:userId',[authJwt.verifyToken,authJwt.isNeighborAdmin],usersCtrl.getUserByCore);
router.get('/coreNeighbor/:coreId/:userId',[authJwt.verifyToken,authJwt.isNeighborAdmin],usersCtrl.getUserByCoreNeighbor);
router.get('/family/:userId',[authJwt.verifyToken,authJwt.isNeighbor],usersCtrl.getFamily);

router.put('/:userId',[authJwt.verifyToken,authJwt.isAdmin,authJwt.isNeighbor],usersCtrl.updateUserById);
router.delete('/user/:userId',[authJwt.verifyToken,authJwt.isAdmin],usersCtrl.deleteUserById);

export default router;