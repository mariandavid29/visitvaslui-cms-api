const catchAsync = require('../utils/catchAsync');

exports.getSights = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      sights: 'A mers!',
    },
  });
});