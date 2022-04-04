"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var codesCtrl = _interopRequireWildcard(require("../controllers/codes.controller"));

var _middleware = require("../middleware");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const router = (0, _express.Router)();
router.post('/:userId', [_middleware.authJwt.verifyToken, _middleware.authJwt.isNeighbor], codesCtrl.createCode);
router.get('/', [_middleware.authJwt.verifyToken, _middleware.authJwt.isNeighbor], codesCtrl.getCodes); // router.get('/',codesCtrl.getCodes);

router.get('/user/:userId', [_middleware.authJwt.verifyToken, _middleware.authJwt.isNeighbor], codesCtrl.getCodesByUser); // router.get('/user/:userId',codesCtrl.getCodesByUser);

router.get('/:codeId', codesCtrl.getCodeById); // router.put('/update/:codeId',codesCtrl.updateCodeById);

router.put('/update/:userId/:codeId', [_middleware.authJwt.verifyToken, _middleware.authJwt.isNeighbor], codesCtrl.updateCodeById);
router.delete('/:codeId', [_middleware.authJwt.verifyToken, _middleware.authJwt.isAdmin], codesCtrl.deleteCodeById);
var _default = router;
exports.default = _default;
//# sourceMappingURL=codes.routes.js.map