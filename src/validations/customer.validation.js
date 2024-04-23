const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const getCustomers = {
    query: Joi.object().keys({
      first_name: Joi.string(),
      last_name: Joi.string(),
      email: Joi.string().email(),
      dob: Joi.string(),
      gender: Joi.string().allow('').optional()

      // sortBy: Joi.string(),
      // limit: Joi.number().integer(),
      // page: Joi.number().integer(),
    }),
  };

  module.exports = {
    getCustomers,
   
  }