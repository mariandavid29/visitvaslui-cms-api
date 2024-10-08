const express = require('express');
const sightController = require('../controllers/sightController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, sightController.getSights)
  .post(
    authController.protect,
    sightController.uploadSightImages,
    sightController.createSight,
    sightController.resizeSightImages,
  );

module.exports = router;
