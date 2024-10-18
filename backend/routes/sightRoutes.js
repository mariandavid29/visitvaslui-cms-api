const express = require('express');
const sightController = require('../controllers/sightController');
const authController = require('../controllers/authController');
const validationController = require('../controllers/validationController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, sightController.getAllSights)
  .post(authController.protect, sightController.createSight);

router.route('/:lang/:slug').get(authController.protect, sightController.getSightBySlug);

router
  .route('/:id')
  .get(authController.protect, sightController.getSight)
  .patch(authController.protect, sightController.updateSight)
  .delete(authController.protect, sightController.deleteSight);

router
  .route('/:id/imgs')
  .patch(
    authController.protect,
    sightController.uploadSightImages,
    validationController.checkSightImages,
    sightController.saveSightImages,
    sightController.deleteSightImages
  );

module.exports = router;
