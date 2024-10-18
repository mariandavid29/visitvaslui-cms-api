const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('node:path');
const Sight = require('../models/sightModel');
const AppError = require('../utils/appError');
const saveImg = require('../utils/saveImg');
const removeFile = require('../utils/removeFile');
const catchAsync = require('../utils/catchAsync');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadSightImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 5 },
]);

exports.saveSightImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover && !req.files.images) {
    return next();
  }

  if (req.files.imageCover) {
    req.imageCover = `sight-${uuidv4()}-cover.jpeg`;
    const imagePath = path.join(__basedir, '/public/img/sights', req.imageCover);
    await saveImg(req.files.imageCover[0].buffer, imagePath);
  }

  if (req.files.images) {
    await Promise.all(
      req.files.images.map(img => {
        const fileName = `sight-${uuidv4()}-extra.jpeg`;
        req.sight.images.push(fileName);

        const imagePath = path.join(__basedir, '/public/img/sights', fileName);
        return saveImg(img.buffer, imagePath);
      })
    );
  }

  return next();
});

exports.deleteSightImages = catchAsync(async (req, res, next) => {
  const { imagesToDelete } = req.body;

  if (req.imageCover) {
    if (req.sight.imageCover) {
      const imagePath = path.join(__basedir, '/public/img/sights', req.sight.imageCover);
      await removeFile(imagePath);
    }
    req.sight.imageCover = req.imageCover;
  }

  if (req.imagesToDeleteNum > 0) {
    await Promise.all(
      imagesToDelete.map(img => {
        const imagePath = path.join(__basedir, 'public/img/sights', img);
        return removeFile(imagePath);
      })
    );

    req.sight.images = req.sight.images.filter(img => !imagesToDelete.includes(img));
  }

  const newSight = await req.sight.save();

  res.status(200).json({
    status: 'success',
    data: {
      sight: newSight,
    },
  });
});

exports.getAllSights = catchAsync(async (req, res, next) => {
  const sights = await Sight.find({});

  res.status(200).json({
    status: 'success',
    data: {
      sights,
    },
  });
});

exports.getSightBySlug = catchAsync(async (req, res, next) => {
  // DECONSTRUCT PARAMS
  const { slug, lang } = req.params;

  // DETERMINE THE SLUG LANG
  const slugLang = lang === 'en' ? 'slugEn' : 'slugRo';

  const query = {};
  query[slugLang] = slug;

  const sight = await Sight.findOne(query);

  if (!sight) {
    return next(new AppError('The sight does not exist!', 404));
  }

  return res.status(200).json({
    status: 'success',
    data: {
      sight,
    },
  });
});

exports.getSight = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const sight = await Sight.findById(id);

  return res.status(200).json({
    status: 'success',
    data: {
      sight,
    },
  });
});

exports.createSight = catchAsync(async (req, res, next) => {
  const newSight = await Sight.create(req.body);
  res.status(200).json({
    status: 'success',
    data: {
      sight: newSight,
    },
  });
});

exports.updateSight = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updatedSight = await Sight.findOneAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });

  return res.status(200).json({
    status: 'success',
    data: {
      sight: updatedSight,
    },
  });
});

exports.deleteSight = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const query = Sight.findOneAndDelete({ _id: id });
  query.select('imageCover images');

  const sightImages = await query;

  if (!sightImages) {
    return next(new AppError('A sight with this id does not exist!', 404));
  }

  if (sightImages.imageCover) {
    const imageCoverPath = path.join(
      __basedir,
      '/public/img/sights',
      sightImages.imageCover
    );
    await removeFile(imageCoverPath);
  }

  await Promise.all(
    sightImages.images.map(img => {
      const imgPath = path.join(__basedir, '/public/img/sights', img);
      return removeFile(imgPath);
    })
  );

  return res.status(204).json({
    status: 'success',
    data: {},
  });
});
