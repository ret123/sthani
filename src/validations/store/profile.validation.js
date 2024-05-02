// profileValidation.js

const Joi = require('joi');

const { Customer } = require('../../models');

// const updateProfileValidation = async (userId) => {
//   try {
//     // Query the database to check if the user has an email or phone number saved
//     const user = await Customer.findById(userId);
//     const hasEmail = !!user.email;
//     const hasPhone = !!user.phone;

   
//     const schema = Joi.object().keys({
//       email: hasPhone ? Joi.string().email().required() : Joi.string().email().allow(''),
//       phone: hasEmail ? Joi.string().required() : Joi.string().allow(''),
//       first_name: Joi.string().required(),
//       last_name: Joi.string().required(),
//       dob: Joi.string().required(),
//       gender: Joi.string().allow('')
//     });

//     return schema;
//   } catch (error) {
//     throw new Error('Error fetching user profile');
//   }
// };

const updateProfileValidation = async (userId) => {
  try {
  
    const user = await Customer.findById(userId);
    const hasEmail = !!user.email;
    const hasMobile = !!user.mobile;

    const schema = Joi.object().keys({
      email: Joi.string().email().allow(''),
      mobile: Joi.string().allow(''),
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      dob: Joi.string().required(),
      gender: Joi.string().allow('')
    });

  
    const uniqueSchema = schema.keys({
      email: hasMobile ? Joi.string().email().required() : Joi.string().email().allow('').custom(async (value, helpers) => {
        if (value !== '') {
          const existingUser = await Customer.findOne({ email: value });
          if (existingUser && existingUser._id.toString() !== userId) {
            return helpers.error('any.unique');
          }
        }
        return value;
      }),
      mobile: hasEmail ? Joi.string().required() : Joi.string().allow('').custom(async (value, helpers) => {
        if (value !== '') {
          const existingUser = await Customer.findOne({ mobile: value });
          if (existingUser && existingUser._id.toString() !== userId) {
            return helpers.error('any.unique');
          }
        }
        return value;
      })
    });

    return uniqueSchema;
  } catch (error) {
    throw new Error('Error fetching user profile');
  }
};


module.exports = { updateProfileValidation };
