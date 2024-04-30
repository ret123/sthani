// profileValidation.js

const Joi = require('joi');

const { Customer } = require('../../models');

const updateProfileValidation = async (userId) => {
  try {
    // Query the database to check if the user has an email or phone number saved
    const user = await Customer.findById(userId);
    const hasEmail = !!user.email;
    const hasPhone = !!user.phone;

   
    const schema = Joi.object().keys({
      email: hasPhone ? Joi.string().email().required() : Joi.string().email().allow(''),
      phone: hasEmail ? Joi.string().required() : Joi.string().allow(''),
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      dob: Joi.string().required(),
      gender: Joi.string().allow('')
    });

    return schema;
  } catch (error) {
    throw new Error('Error fetching user profile');
  }
};

module.exports = { updateProfileValidation };
