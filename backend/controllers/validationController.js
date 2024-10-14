const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Sight = require('../models/sightModel');

exports.checkSightImages = catchAsync(async (req, res, next) => {
  if (!req.body) {
    return next(new AppError('This is not a valid payload for this request!', 400));
  }

  const { images } = req.files;
  req.body.imagesToDelete =
    req.body.imagesToDelete === undefined
      ? []
      : Array.isArray(req.body.imagesToDelete)
        ? req.body.imagesToDelete
        : [req.body.imagesToDelete];

  const sight = await Sight.findById(req.params.id);

  if (!sight) {
    return next(new AppError('There is no sight with this id!', 404));
  }

  req.imagesToDeleteNum = req.body.imagesToDelete?.length ?? 0;
  req.imagesToAddNum = images?.length ?? 0;

  if (req.imagesToDeleteNum > sight.images.length) {
    return next(new AppError('Number of imagesToDelete is invalid!', 400));
  }

  if (sight.images.length + req.imagesToAddNum - req.imagesToDeleteNum > 5) {
    return next(new AppError('A sight must have a maximum of 5 extra images!', 400));
  }

  req.sight = sight;

  return next();
});
