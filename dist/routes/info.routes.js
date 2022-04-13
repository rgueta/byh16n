"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var infoCtrl = _interopRequireWildcard(require("../controllers/info.controller"));

var _middleware = require("../middleware");

var _path = _interopRequireDefault(require("path"));

var _multer = _interopRequireDefault(require("multer"));

var _uuid = require("uuid");

var tools = _interopRequireWildcard(require("../tools"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const router = (0, _express.Router)(); // multer add image  -------------

let folder = '';
tools.monthlyFolder().then(async (f, fail) => {
  if (fail) {
    console.log('Error to generate folder');
    return;
  }

  try {
    folder = (await f.toString()) + '/';

    const fullPath = _path.default.join(__dirname, '../public/img/uploads/', folder);

    console.log('info routes --> ',fullPath + ', folder --> ' +folder);

    const imgId = (0, _uuid.v4)();

    const storage = _multer.default.diskStorage({
      destination: (req, file, cb) => {
        _fs.default.mkdirSync(fullPath, {
          recursive: true
        });

        cb(null, fullPath);
      },
      filename: (req, file, cb) => {
        // console.log(file);
        cb(null, (0, _uuid.v4)() + _path.default.extname(file.originalname));
      }
    });

    const upload = (0, _multer.default)({
      storage
    });
    router.post('/:userId', upload.single('image'), [_middleware.authJwt.isAdmin], infoCtrl.createInfo);
  } catch (err) {
    console.log('Error multer --> ', err);
  }
});
router.get('/:userId', [_middleware.authJwt.isNeighbor], infoCtrl.getInfo);
router.get('/all/:userId', [_middleware.authJwt.isNeighbor], infoCtrl.getInfoAdmin);
router.post('/updStatus/:userId/:infoId', [_middleware.authJwt.isAdmin], infoCtrl.updInfoStatus);
var _default = router;
exports.default = _default;
//# sourceMappingURL=info.routes.js.map