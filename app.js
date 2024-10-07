const express = require('express');

// THIRD PARTY MIDDLEWARE
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
// const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const { xss } = require('express-xss-sanitizer');

const sightRouter = require('./routes/sightRoutes');
const adminRouter = require('./routes/adminRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const app = express();

// ALWAYS THE FIRST MIDDLEWARE
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));

app.use(mongoSanitize());

app.use(xss());

app.use('/api/v1/sights', sightRouter);

app.use('/api/v1/admin', adminRouter);

// AFTER ALL THE ROUTES
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

// WHITELIST BASED ON MODEL
// app.use(hpp());

module.exports = app;