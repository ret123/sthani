const httpStatus = require('http-status');
const {Customer } = require('../models');
const ApiError = require('../utils/ApiError');
const path = require('path');
const fs = require('fs');


const queryCustomers = async (filter, options) => {
    // const brands = await Brand.paginate(filter, options);
    const customers = await Customer.find({});
    return customers;
  };

  module.exports = {
    queryCustomers,
   
  };