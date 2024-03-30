const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const brandValidation = require('../../validations/brand.validation');
const brandController = require('../../controllers/brand.controller');
// const multer = require('multer');
// var upload = multer();
// const {imageUpload} = require('../../services/fileUpload.service')

const router = express.Router();

router
  .route('/')
  .post(auth('manageBrands'),  brandController.createBrand)
  .get(auth('getBrands'), validate(brandValidation.getBrands), brandController.getBrands);

router
  .route('/:brandId')
  .get(auth('getBrands'), validate(brandValidation.getBrand),brandController.getBrand)
  .patch(auth('manageBrands'),brandController.updateBrand)
  .delete(auth('manageBrands'), validate(brandValidation.deleteBrand), brandController.deleteBrand);


module.exports = router;
