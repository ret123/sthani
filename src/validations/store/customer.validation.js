const Joi = require('joi');
// const { password } = require('./custom.validation');





const update = {
  body: Joi.object().keys({
    email: Joi.string().email().allow(''),
    phone: Joi.string().allow(''),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    dob: Joi.string().required(),
    gender: Joi.string().allow(''),
    
  }),
};




module.exports = {
  update
};
