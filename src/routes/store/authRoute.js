const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/store/auth.validation');
const authController = require('../../controllers/store/auth.controller');


const router = express.Router();

router.post('/sendotp', validate(authValidation.sendotp), authController.sendOTP);
router.post('/verifyotp', validate(authValidation.verifyOTP), authController.verifyOTP);
router.post('/register', validate(authValidation.register), authController.register);  


module.exports = router;

