"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var visitorCtrl = _interopRequireWildcard(require("../controllers/visitors.controller"));

var _middleware = require("../middleware");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const router = (0, _express.Router)();
router.post('/', [_middleware.authJwt.verifyToken, _middleware.authJwt.isNeighbor], visitorCtrl.createVisitor);
router.get('/', visitorCtrl.getVisitors);
router.get('/user/:userId', visitorCtrl.getVisitorsByUser);
router.get('/:visitorId', visitorCtrl.getVisitorById);
router.put('/:visitorId', [_middleware.authJwt.verifyToken, _middleware.authJwt.isAdmin, _middleware.authJwt.isNeighbor], visitorCtrl.updateVisitorById); // router.put('/simple/:visitorId/',[authJwt.verifyToken,authJwt.isNeighbor],
//     visitorCtrl.updateSimpleVisitorById);

router.put('/simple/:userId/:visitorId', [_middleware.authJwt.verifyToken, _middleware.authJwt.isNeighbor], visitorCtrl.updateSimpleVisitorById);
router.delete('/:visitorId', [_middleware.authJwt.verifyToken, _middleware.authJwt.isAdmin], visitorCtrl.deleteVisitorById);
var _default = router;
exports.default = _default;
//# sourceMappingURL=visitors.routes.js.map