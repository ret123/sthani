const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const categoryValidation = require('../../validations/category.validation');
const categoryController = require('../../controllers/category.controller');
const router = express.Router();

router
  .route('/')
  .post(auth('manageCategories'), validate(categoryValidation.createCategory), categoryController.createCategory)
  .get(auth('getCategories'), validate(categoryValidation.getCategories), categoryController.getCategories);

router
  .route('/:categoryId')
  .get(auth('getcategories'), validate(categoryValidation.getCategory), categoryController.getCategory)
  .patch(auth('manageCategories'),categoryController.updateCategory)
  .delete(auth('manageCategories'), validate(categoryValidation.deleteCategory), categoryController.deleteCategory);

module.exports = router;
