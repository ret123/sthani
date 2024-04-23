const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const productValidation = require('../../validations/product.validation');
const productController = require('../../controllers/product.controller');
const router = express.Router();

router.get('/getProducts', validate(productValidation.getProducts), productController.getProducts);

module.exports = router;