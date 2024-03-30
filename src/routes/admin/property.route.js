const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const propertyValidation = require('../../validations/property.validation');
const propertyController = require('../../controllers/property.controller');
const router = express.Router();

router
  .route('/')
  .post(auth('manageProperties'), validate(propertyValidation.createProperty), propertyController.createProperty)
  .get(auth('getProperties'), validate(propertyValidation.getProperties), propertyController.getProperties);

router
  .route('/:propertyId')
  .get(auth('getProperties'), validate(propertyValidation.getProperty), propertyController.getProperty)
  .patch(auth('manageProperties'), validate(propertyValidation.updateProperty),propertyController.updateProperty)
  .delete(auth('manageProperties'), validate(propertyValidation.deleteProperty), propertyController.deleteProperty);

module.exports = router;
