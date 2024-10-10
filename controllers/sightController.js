const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('../utils/catchAsync');
const Sight = require('../models/sightModel');
const AppError = require('../utils/appError');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new AppError('Not an image! Please upload only images', 400), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadSightImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 5 },
]);

exports.resizeSightImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  req.newSight.imageCover = `sight-${req.newSight.id}-${Date.now()}-cover.jpeg`;

  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`./public/img/sights/${req.newSight.imageCover}`);

  await Promise.all(
    req.files.images.map((img, i) => {
      const fileName = `sight-${req.newSight.id}-${Date.now()}-${i + 1}.jpeg`;
      req.newSight.images.push(fileName);
      return sharp(img.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`./public/img/sights/${fileName}`);
    }),
  );

  const updatedSight = await req.newSight.save();

  return res.status(200).json({
    status: 'success',
    data: {
      sight: updatedSight,
    },
  });
});

exports.getSights = catchAsync(async (req, res, next) => {
  const sights = await Sight.find({});

  res.status(200).json({
    status: 'success',
    data: {
      sights,
    },
  });
});

exports.createSight = catchAsync(async (req, res, next) => {
  const newSight = await Sight.create(req.body);
  req.newSight = newSight;
  next();
});
