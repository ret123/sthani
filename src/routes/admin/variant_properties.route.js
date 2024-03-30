const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const variantPropertiesValidation = require('../../validations/variant_properties.validation');
const variantPropertiesController = require('../../controllers/variant_properties.controller');
const router = express.Router();

router
  .route('/')
  .post(auth('manageVariantProperties'), validate(variantPropertiesValidation.createVariantProperties), variantPropertiesController.createVariantProperties)
  .get(auth('getVariantProperties'), validate(variantPropertiesValidation.getVariantProperties), variantPropertiesController.getVariantProperties);

router
  .route('/:variantPropertyId')
  .get(auth('getVariantProperties'), validate(variantPropertiesValidation.getVariantProperty), variantPropertiesController.getVariantProperty)
  .patch(auth('manageVariantProperties'), validate(variantPropertiesValidation.updateVariantProperty),variantPropertiesController.updateVariantProperty)
  .delete(auth('manageVariantProperties'), validate(variantPropertiesValidation.deleteVariantProperty), variantPropertiesController.deleteVariantProperty);

module.exports = router;
