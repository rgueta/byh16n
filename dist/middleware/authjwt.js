"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyToken = exports.isNeighbor = exports.isAdmin = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = _interopRequireDefault(require("../config"));

var _Users = _interopRequireDefault(require("../models/Users"));

var _Roles = _interopRequireDefault(require("../models/Roles"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// export const verifyToken = async (req,res, next) =>{
//     try{
//         const token = req.headers["x-access-token"];
//         console.log(token);
//         if(!token) return res.status(403).json({message:'Not token provided'})
//         const decoded = await jwt.verify(token,config.auth.SECRET,(err,decoded) => {
//             if(err){
//                 console.log(err);
//                 return res.status(401).json({message:'jwt verify',
//         'error': err.message});
//             }else{
//                 console.log('decoded: ' + decoded);
//             }
//         });
//         next();
//         req.userId = decoded.id;
//         const user = await Users.findById(req.userId,{pwd:0});
//         if(!user) return res.status(404).json({message:"no user found"});
//         console.log(decoded);
//         next();
//     }catch(e){
//         return res.status(401).json({message:'Unauthorized',
//         'error': e.message})
//     }
// };
// --- Original code  ---
const verifyToken = async (req, res, next) => {
  console.log('verifyToken req.headers --> ', req.headers);

  try {
    let token = req.header('Authorization');
    token = token.replace('Bearer ', '');
    console.log('verifyToken header[Authorization] --> ', token);
    if (!token) return res.status(403).json({
      message: 'Not token provided'
    });

    const decoded = _jsonwebtoken.default.verify(token, _config.default.auth.SECRET);

    console.log('decoded: ' + JSON.stringify(decoded)); // req.paramss.userId = decoded.id;

    const user = await _Users.default.findById(req.params.userId, {
      pwd: 0
    });
    if (!user) return res.status(404).json({
      message: "no user found"
    });
    console.log(decoded);
    next();
    return;
  } catch (e) {
    console.log('verifyToken Error --> ', e.message);
    return res.status(401).json(e); // return res.status(401).json({message:'Unauthorized',
    // 'error': e.message})
  }
};

exports.verifyToken = verifyToken;

const isAdmin = async (req, res, next) => {
  console.log('isAdmin params --> ', req.params);
  const user = await _Users.default.findById(req.params.userId);
  const roles = await _Roles.default.find({
    _id: {
      $in: user.roles
    }
  });
  console.log(roles);

  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name === 'admin') {
      next();
      return;
    }
  }

  return res.status(403).json({
    message: "Require admin role"
  });
};

exports.isAdmin = isAdmin;

const isNeighbor = async (req, res, next) => {
  console.log('isNeighbor req.params', req.params);
  const founduser = await _Users.default.findById(req.params.userId);
  if (!founduser) return res.status(401).json({
    'error': 'isNeighbor user not found'
  });
  const found_roles = await _Roles.default.find({
    _id: {
      $in: founduser.roles
    }
  });
  if (!found_roles) return res.status(401).json({
    'error': 'roles not found for user'
  });
  console.log('isNeighbor role found --> ', found_roles);

  for (let i = 0; i < found_roles.length; i++) {
    if (found_roles[i].name === 'neighbor') {
      next();
      return;
    }
  }

  return res.status(403).json({
    message: "Require neighbor role"
  });
};

exports.isNeighbor = isNeighbor;
//# sourceMappingURL=authjwt.js.map