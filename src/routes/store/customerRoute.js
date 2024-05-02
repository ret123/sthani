const express = require('express');
const validate = require('../../middlewares/validate');
const customerValidation = require('../../validations/store/customer.validation');
const customerController = require('../../controllers/store/customer.controller');
const auth = require('../../middlewares/auth');
const authenticateToken = require('../../middlewares/customerAuth');


const router = express.Router();


router.patch('/update-profile', authenticateToken, customerController.updateProfile); 



module.exports = router;

