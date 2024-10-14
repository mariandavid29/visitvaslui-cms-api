const multer = require('multer');
const sharp = require('sharp');
const Sight = require('../models/sightModel');
const AppError = require('../utils/appError');
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

exports.checkSightImages = catchAsync(async (req, res, next) => {
  if (!req.body) {
    return next(
      new AppError('This is not a valid payload for this request!', 400),
    );
  }

  const { imagesToDelete } = req.body;

  if (!Array.isArray(imagesToDelete)) {
    return next(new AppError('ImagesToDelete needs to be an array!', 400));
  }

  const { id } = req.params;
  const { images } = req.files;

  req.imagesToDeleteNum = 0;
  req.imagesToAddNum = 0;

  const query = Sight.findById(id);

  const sight = await query;

  if (!sight) {
    return next(new AppError('There is no sight with this id!', 404));
  }

  if (imagesToDelete) {
    req.imagesToDeleteNum = imagesToDelete.length;
  }
  if (images) {
    req.imagesToAddNum = images.length;
  }

  if (req.imagesToDeleteNum > sight.images.length) {
    return next(
      new AppError('This is not a valid payload for this request!', 400),
    );
  }

  if (sight.images.length + req.imagesToAddNum - req.imagesToDeleteNum > 5) {
    return next(
      new AppError('This is not a valid payload for this request!', 400),
    );
  }

  req.sight = sight;

  return next();
});

exports.saveSightImages = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!req.files.imageCover && !req.files.images) {
    return next();
  }

  if (req.files.imageCover) {
    req.imageCover = `sight-${id}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`./public/img/sights/${req.imageCover}`);
  }

  if (req.files.images) {
    await Promise.all(
      req.files.images.map((img, i) => {
        const fileName = `sight-${id}-${Date.now()}-${i + 1}.jpeg`;

        req.sight.images.push(fileName);

        return sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`./public/img/sights/${fileName}`);
      }),
    );
  }

  return next();
});

exports.deleteSightImages = catchAsync(async (req, res, next) => {
  const { imagesToDelete } = req.body;

  if (req.imageCover) {
    if (req.sight.imageCover) {
      await removeFile(
        `${__dirname}/../public/img/sights`,
        req.sight.imageCover,
      );
    }
    req.sight.imageCover = req.imageCover;
  }

  if (imagesToDelete && req.imagesToDeleteNum > 0) {
    await Promise.all(
      imagesToDelete.map((img) =>
        removeFile(`${__dirname}/../public/img/sights`, img),
      ),
    );

    req.sight.images = req.sight.images.filter(
      (img) => !imagesToDelete.includes(img),
    );
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
