"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRoles = void 0;

var _Roles = _interopRequireDefault(require("../models/Roles"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createRoles = async () => {
  const count = await _Roles.default.estimatedDocumentCount();
  if (count > 0) return;

  try {
    const values = await Promise.all([new _Roles.default({
      name: 'admin'
    }).save(), new _Roles.default({
      name: 'supervisor'
    }).save(), new _Roles.default({
      name: 'neighbor'
    }).save(), new _Roles.default({
      name: 'relative'
    }).save(), new _Roles.default({
      name: 'provider'
    }).save(), new _Roles.default({
      name: 'visitor'
    }).save()]);
    console.log(values);
  } catch (error) {
    console.error(error);
  }

  new _Roles.default();
};

exports.createRoles = createRoles;
//# sourceMappingURL=initialSetup.js.map