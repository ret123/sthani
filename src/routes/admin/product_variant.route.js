const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const productVariantValidation = require('../../validations/product_variant.validation');
const productVariantController = require('../../controllers/product_variant.controller');
const router = express.Router();

router
  .route('/')
  .post(auth('manageProductVariants'), validate(productVariantValidation.createProductVariant), productVariantController.createProductVariant)
  .get(auth('getProductVariants'), validate(productVariantValidation.getProductVariants), productVariantController.getProductVariants);

router
  .route('/:productVariantId')
  .get(auth('getProductVariants'), validate(productVariantValidation.getProductVariant), productVariantController.getProductVariant)
  .patch(auth('manageProductVariants'), validate(productVariantValidation.updateProductVariant),productVariantController.updateProductVariant)
  .delete(auth('manageProductVariants'), validate(productVariantValidation.deleteProductVariant), productVariantController.deleteProductVariant);

module.exports = router;
