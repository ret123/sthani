const httpStatus = require('http-status');

const ApiError = require('../utils/ApiError');
const path = require('path');
const fs = require('fs');
const { uploadSingleFile, uploadMultipleFile } = require('./fileUpload.service');




const createHome = async (req) => {

    console.log(req);

};




module.exports = {
  createHome
};
