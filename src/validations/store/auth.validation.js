const Joi = require('joi');
// const { password } = require('./custom.validation');

const sendotp = {
  body: Joi.object().keys({
    email: Joi.string().email().allow('').optional(),
    phone: Joi.number().allow('').optional(),
   
  }),
};

const verifyOTP = {
  body: Joi.object().keys({
   
    otp:  Joi.string().required(),
    phone: Joi.number().allow(''),
    email: Joi.string().email().allow(''),
   
  }),
};

const register = {
  body: Joi.object().keys({
    email: Joi.string().email().allow(''),
    phone: Joi.string().allow(''),
    // first_name: Joi.string().required(),
    // last_name: Joi.string().required(),
    // dob: Joi.string().required(),
    // gender: Joi.string().allow(''),
    otp: Joi.number().allow('')
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().email().allow('').optional(),
    
    phone: Joi.string().allow('').optional(),
    otp: Joi.number().allow('')

    
  }),
};


module.exports = {
  sendotp,
  verifyOTP,
  register,
  login 
};
