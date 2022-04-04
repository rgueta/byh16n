"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var housing_unitCtrl = _interopRequireWildcard(require("../controllers/housing_unit.controllers"));

var _middleware = require("../middleware");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const router = (0, _express.Router)();
router.post('/', [_middleware.authJwt.verifyToken, _middleware.authJwt.isAdmin], housing_unitCtrl.createHousing_unit);
router.get('/', housing_unitCtrl.getHousing_unit);
router.get('/onlyHousing_unit', housing_unitCtrl.getOnlyHousing_unit);
router.delete('/:housing_unitId', [_middleware.authJwt.verifyToken, _middleware.authJwt.isAdmin], housing_unitCtrl.deleteHousing_unitById);
var _default = router;
exports.default = _default;
//# sourceMappingURL=housing_unit.routes.js.map