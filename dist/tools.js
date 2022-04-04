"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.monthlyFolder = void 0;

const monthlyFolder = async () => {
  const d = new Date();
  const m = d.getMonth() + 1;
  const folder = (await m.toString()) + d.getFullYear().toString();
  return folder; // throw new ReferenceError("error generated");
};

exports.monthlyFolder = monthlyFolder;
//# sourceMappingURL=tools.js.map