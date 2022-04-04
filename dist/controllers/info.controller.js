"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updInfoStatus = exports.getInfoAdmin = exports.getInfo = exports.createInfo = void 0;

var _info = _interopRequireDefault(require("../models/info.model"));

var _mongoose = require("mongoose");

var _path = _interopRequireDefault(require("path"));

var _sharp = _interopRequireDefault(require("sharp"));

var _fs = _interopRequireWildcard(require("fs"));

var _config = _interopRequireDefault(require("../config"));

var tools = _interopRequireWildcard(require("../tools"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createInfo = async (req, res) => {
  const imgsRoot = _config.default.app.images_root;
  const prefix = _config.default.app.Resized_prefix;
  let folder = '';
  tools.monthlyFolder().then(async (f, fail) => {
    if (fail) {
      res.status(400).json({
        'msg': 'Error to generate folder'
      });
      return;
    }

    folder = (await f.toString()) + '/';

    const fullPath = _path.default.join(__dirname, '../public/', imgsRoot, folder);

    const imgPath = imgsRoot + folder; // Resize image ----------------------------------------

    console.log('resize file--> ', fullPath + req.file.filename);

    try {
      await (0, _sharp.default)(fullPath + req.file.filename).resize(640, 480, {
        fit: _sharp.default.fit.inside,
        withoutEnlargement: true
      }).jpeg({
        quality: 80
      }).toFile(fullPath + prefix + req.file.filename);

      _fs.default.unlink(_path.default.join(fullPath, req.file.filename), e => {
        if (e) {
          console.log('error deleting file: ', error);
        } else {
          console.log('file deleted');
        }
      }); // -- Insert into Mongo  ---------------------


      const {
        title,
        url,
        description
      } = req.body;
      let stats = {};

      try {
        stats = await fileSize(_path.default.join(fullPath, prefix + req.file.filename));
        console.log('file size --> ' + stats.size);
      } catch (err) {
        console.log('Error multer --> ', err);
      }

      const image = prefix + req.file.filename;
      const size = stats.size;
      const newInfo = await (0, _info.default)({
        title,
        url,
        description,
        image,
        'path': imgPath,
        size
      });
      console.log('newInfo', newInfo);

      if (newInfo) {
        const InfoSaved = await newInfo.save();
      }

      res.status(201).json({
        'msg': 'Information created'
      });
    } catch (err) {
      console.log('Error at the end', err);
      res.status(401).json({
        'error': 'Error creating informat ' + err
      });
    }
  });
};

exports.createInfo = createInfo;

const getInfo = async (req, res) => {
  // const info = await information.find({enable : true}).sort({'createdAt':-1});
  const info = await _info.default.aggregate([{
    $match: {
      disable: false
    }
  }, {
    $sort: {
      createdAt: -1
    }
  }, {
    $project: {
      title: 1,
      description: 1,
      url: 1,
      image: 1,
      path: 1,
      disable: 1,
      size: {
        $concat: [{
          $toString: {
            $round: [{
              $divide: ['$size', 1024]
            }, 2]
          }
        }, ' KB']
      },
      createdAt: {
        $dateToString: {
          format: '%Y/%m/%d %H:%M:%S',
          date: '$createdAt',
          timezone: 'America/Los_Angeles'
        }
      }
    }
  }]);

  if (!info) {
    console.log('Error getting info -> ', err);
    res.status(402).json({
      'Error': 'Error getting info' + err
    });
  } else {
    console.log(info);
    res.status(201).json(info);
  }
};

exports.getInfo = getInfo;

const getInfoAdmin = async (req, res) => {
  const info = await _info.default.aggregate([{
    $sort: {
      createdAt: -1
    }
  }, {
    $project: {
      title: 1,
      description: 1,
      url: 1,
      image: 1,
      path: 1,
      disable: 1,
      size: {
        $concat: [{
          $toString: {
            $round: [{
              $divide: ['$size', 1024]
            }, 2]
          }
        }, ' KB']
      },
      createdAt: {
        $dateToString: {
          format: '%Y/%m/%d %H:%M:%S',
          date: '$createdAt',
          timezone: 'America/Los_Angeles'
        }
      }
    }
  }]);

  if (!info) {
    console.log('Error getting info -> ', err);
    res.status(402).json({
      'Error': 'Error getting info' + err
    });
  } else {
    console.log(info);
    res.status(201).json(info);
  }
};

exports.getInfoAdmin = getInfoAdmin;

const updInfoStatus = async (req, res) => {
  // console.log('update info', req.params,req.body)
  await _info.default.updateOne({
    '_id': req.params.infoId
  }, {
    '$set': {
      'disable': req.body.disable
    }
  }, (err, result) => {
    if (err) {
      res.status(401).json({
        'error': 'Info status changed' + err
      });
      return;
    } else {
      res.status(201).json({
        'msg': 'Info status changed'
      });
    }
  });
};

exports.updInfoStatus = updInfoStatus;

async function fileSize(file) {
  const stats = await _fs.default.statSync(file);
  return stats;
}
//# sourceMappingURL=info.controller.js.map