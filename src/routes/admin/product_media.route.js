const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const productMediaValidation = require('../../validations/product_media.validation');
const productMediaController = require('../../controllers/product_media.controller');
const router = express.Router();

router
  .route('/')
  .post(auth('manageProductMedias'), validate(productMediaValidation.createProductMedia), productMediaController.createProductMedia)
  .get(auth('getProductMedias'), validate(productMediaValidation.getProductMedias), productMediaController.getProductMedias);

router
  .route('/:productMediaId')
  .get(auth('getProductMedia'), validate(productMediaValidation.getProductMedia), productMediaController.getProductMedia)
  .patch(auth('manageProductMedias'), validate(productMediaValidation.updateProductMedia),productMediaController.updateProductMedia)
  .delete(auth('manageProductMedias'), validate(productMediaValidation.deleteProductMedia), productMediaController.deleteProductMedia);

module.exports = router;
