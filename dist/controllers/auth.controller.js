"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signUp = exports.signIn = exports.refresh = void 0;

var _Users = _interopRequireDefault(require("../models/Users"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = _interopRequireDefault(require("../config"));

var _Roles = _interopRequireDefault(require("../models/Roles"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const signUp = async (req, res) => {
  const {
    name,
    email,
    username,
    pwd,
    privada,
    house,
    sim,
    gender,
    avatar,
    roles
  } = req.body;
  const newUser = new _Users.default({
    name,
    email,
    username,
    privada,
    house,
    sim,
    gender,
    avatar,
    roles,
    pwd: await _Users.default.encryptPassword(pwd)
  });

  if (roles) {
    const foundRoles = await _Roles.default.find({
      name: {
        $in: roles
      }
    });
    newUser.roles = foundRoles.map(role => role._id);
  } else {
    const role = await _Roles.default.findOne({
      name: 'visitor'
    });
    newUser.roles = [role._id];
  }

  const savedUser = await newUser.save();

  const token = _jsonwebtoken.default.sign({
    id: savedUser._id
  }, _config.default.auth.SECRET, {
    expiresIn: _config.default.auth.token_time
  });

  console.log(savedUser);
  res.status(200).json({
    'token': token
  });
};

exports.signUp = signUp;

const signIn = async (req, res) => {
  console.log('email:  --> ' + req.body.email + ', pwd : ' + req.body.pwd); // const foundUser = await Users.findOne({email: req.body.email}).populate("roles");

  await _Users.default.aggregate([{
    $lookup: {
      'from': 'cores',
      'localField': '_id',
      'foreignField': 'Houses.detail.userId',
      'as': 'user_core'
    }
  }, {
    $unwind: '$user_core'
  }, {
    $lookup: {
      'from': 'roles',
      'localField': 'roles',
      'foreignField': '_id',
      'as': 'user_roles'
    }
  }, //  {$unwind : '$user_roles'},
  {
    $match: {
      email: String(req.body.email)
    }
  }, {
    $project: {
      _id: 1,
      name: 1,
      sim: 1,
      coreName: '$user_core.Name',
      coreSim: '$user_core.Sim',
      email: 1,
      pwd: 1,
      roles: '$user_roles'
    }
  }], async function (err, foundUser) {
    if (err || foundUser == '') return res.status(401).json({
      'errId': 1,
      'ErrMsg': "Usuario no encontrado"
    });
    console.log('Signin foundUser -- > ', foundUser);
    const matchPwd = await _Users.default.comparePassword(req.body.pwd, foundUser[0].pwd);
    if (!matchPwd) return res.status(401).json({
      token: '',
      ErrMsg: 'Invalid password'
    });

    const accessToken = _jsonwebtoken.default.sign({
      id: foundUser[0]._id
    }, _config.default.auth.SECRET, {
      expiresIn: "1m"
    });

    if (!accessToken) return res.status(401).json({
      refreshToken: '',
      message: 'Something goes wrong'
    });

    const refreshToken = _jsonwebtoken.default.sign({
      id: foundUser[0]._id
    }, _config.default.auth.SECRET_REFRESH, {
      expiresIn: "1y"
    });

    res.status(201).json({
      'accessToken': accessToken,
      'refreshToken': refreshToken,
      'userId': foundUser[0]._id,
      'roles': foundUser[0].roles,
      'sim': foundUser[0].sim,
      'core_sim': foundUser[0].coreSim,
      'coreName': foundUser[0].coreName
    });
  });
};

exports.signIn = signIn;

const refresh = async (req, res) => {
  console.log('--------------------------------------   refresh req. --> ', req.headers); // const token = req.headers['refresh'];
  // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYzY0YzA0ZGY2ZjU1NmE5NDZkODkxZiIsImlhdCI6MTYzMjU0NDA3MCwiZXhwIjoxNjY0MTAxNjcwfQ.aEGw_cuqDiuiBCfnAy_2DaLE2oI8aDUeFq8jBpst_1U';

  let token = await req.header('Authorization');
  token = token.replace('Bearer ', '');
  console.log('refresh Token --> ', token);

  if (!token) {
    res.status(400).json({
      message: 'Something goes wrong.'
    });
  }

  try {
    console.log('----------------   Refresh token before erifyResult  ---> ');

    const verifyResult = _jsonwebtoken.default.verify(token, _config.default.auth.SECRET_REFRESH, {
      ignoreExpiration: true
    });

    console.log('----------------   Refresh token after verifyResult  ---> ', verifyResult);

    const foundUser = _Users.default.find({
      _id: verifyResult.id
    });

    if (foundUser) {
      console.log('Refresh token foundUser yes ---');

      const accessToken = _jsonwebtoken.default.sign({
        id: verifyResult.id
      }, _config.default.auth.SECRET, {
        expiresIn: "1m"
      });

      const refreshToken = _jsonwebtoken.default.sign({
        id: verifyResult.id
      }, _config.default.auth.SECRET_REFRESH, {
        expiresIn: "1m"
      });

      res.status(200).json({
        'userId': verifyResult.id,
        'accessToken': accessToken,
        'refreshToken': refreshToken
      });
    } else {
      console.log('Refresh token NOT foundUser ---');
      res.status(400).json({
        message: 'Something goes wrong.'
      });
    }
  } catch (e) {
    console.log('refresh Token catch error ! --> ', e);
    res.status(401).json({
      message: 'Something goes wrong.'
    });
  }
};

exports.refresh = refresh;
//# sourceMappingURL=auth.controller.js.map