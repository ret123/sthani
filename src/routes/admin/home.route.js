const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const homeValidation = require('../../validations/home.validation');
const homeController = require('../../controllers/home.controller');
// const multer = require('multer');
// var upload = multer();
// const {imageUpload} = require('../../services/fileUpload.service')

const router = express.Router();

router
  .route('/')
  .post(auth('manageHome'), validate(homeValidation.createHome),homeController.createHome)
  

module.exports = router;
