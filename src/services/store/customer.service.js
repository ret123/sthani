const httpStatus = require('http-status');

const ApiError = require('../../utils/ApiError');
const { Customer } = require('../../models');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createCustomer = async (userBody) => {
  if (await Customer.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return Customer.create(userBody);
};

module.exports = {
    createCustomer,
   
  };
  