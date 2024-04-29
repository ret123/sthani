const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/store/customer.validation');
const authController = require('../../controllers/store/customer.controller');


const router = express.Router();


// router.post('/update', validate(authValidation.register), authController.register); 



module.exports = router;

