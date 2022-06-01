import {Router} from 'express'
import * as usersCtrl from '../controllers/users.controller';
import { authJwt, verifySignup } from "../middleware";
const router = Router();

// router.post('/user',[authJwt.verifyToken,authJwt.isAdmin],usersCtrl.createUser);
router.post('/user',usersCtrl.createUser);
router.post('/user/:userId',[authJwt.verifyToken,authJwt.isAdmin],usersCtrl.createUser);
router.post('/register/',usersCtrl.RegisterUser);
router.post('/block/',[authJwt.isAdmin],usersCtrl.blockUser);
router.post('/unblock/:userId',usersCtrl.RegisterUser);
router.get('/',usersCtrl.getUsers);
router.get('/user/:userId',usersCtrl.getUserById);
router.get('/user/core/:coreId',usersCtrl.getUserByCore);
router.put('/:userId',[authJwt.verifyToken,authJwt.isAdmin,authJwt.isNeighbor],usersCtrl.updateUserById);
router.delete('/user/:userId',[authJwt.verifyToken,authJwt.isAdmin],usersCtrl.deleteUserById);

export default router;