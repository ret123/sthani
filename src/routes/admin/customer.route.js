const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const customerValidation = require('../../validations/customer.validation')
const customerController = require('../../controllers/customer.controller');
// const multer = require('multer');
// var upload = multer();
// const {imageUpload} = require('../../services/fileUpload.service')

const router = express.Router();

router
  .route('/')
  .get(auth('getCustomers'), validate(customerValidation.getCustomers),customerController.getCustomers);

router
//   .route('/:brandId')
//   .get(auth('getBrands'), validate(brandValidation.getBrand),brandController.getBrand)
//   .patch(auth('manageBrands'),brandController.updateBrand)
//   .delete(auth('manageBrands'), validate(brandValidation.deleteBrand), brandController.deleteBrand);


module.exports = router;
