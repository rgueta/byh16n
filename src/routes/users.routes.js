import {Router} from 'express'
import * as usersCtrl from '../controllers/users.controller';
import { authJwt, verifySignup } from "../middleware";
const router = Router();

router.post('/user',[authJwt.verifyToken,authJwt.isAdmin],usersCtrl.createUser);
router.post('/user/:userId',[authJwt.verifyToken,authJwt.isAdmin],usersCtrl.createUser);
router.post('/register/',usersCtrl.RegisterUser);
router.post('/lock/:userId/:neighborId',[authJwt.verifyToken,authJwt.isAdmin],usersCtrl.lockUser);
router.post('/unlock/:userId/:neighborId',[authJwt.verifyToken,authJwt.isAdmin],usersCtrl.unlockUser);
router.get('/',usersCtrl.getUsers);
router.get('/user/:userId',usersCtrl.getUserById);
router.get('/core/:coreId/:userId',[authJwt.verifyToken,authJwt.isAdmin],usersCtrl.getUserByCore);
router.get('/family/:userId',[authJwt.verifyToken,authJwt.isNeighbor],usersCtrl.getFamily);

router.put('/:userId',[authJwt.verifyToken,authJwt.isAdmin,authJwt.isNeighbor],usersCtrl.updateUserById);
router.delete('/user/:userId',[authJwt.verifyToken,authJwt.isAdmin],usersCtrl.deleteUserById);

export default router;