const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const cookieOptions = {
  expires: new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
  ),
  httpOnly: true,
};

if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

const signToken = () =>
  jwt.sign({}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  // 1. CHECK IF USERNAME AND PASSWORD EXIST
  if (!username || !password)
    return next(new AppError('Please provide username and password!', 400));

  // 2. CHECK IF USERNAME AND PASSWORD ARE CORRECT
  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  )
    return next(new AppError('Username or password are wrong!', 401));

  const token = signToken();

  res.cookie('jwt', token, cookieOptions);
  return res.status(200).json({
    status: 'success',
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // GETTING TOKEN, CHECK IF IT IS THERE
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')
  ) {
    return next(new AppError('You are not logged in!', 401));
  }
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return next(new AppError('You are not logged in!', 401));
  }

  // VERIFY TOKEN
  await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // GRANT ACCESS
  return next();
});
