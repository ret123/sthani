const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { propertyService } = require('../services');

const createProperty = catchAsync(async (req, res) => {
  const property = await propertyService.createProperty(req);
  res.status(httpStatus.CREATED).send(property);
});

const getProperties = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await propertyService.queryProperties(filter, options);
  res.send(result);
});

const getProperty = catchAsync(async (req, res) => {
  const property = await propertyService.getPropertyById(req.params.propertyId);
  if (!property) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Property not found');
  }
  res.send(property);
});

const updateProperty = catchAsync(async (req, res) => {
    // to work on updating files
  const property = await propertyService.updatePropertyById(req.params.propertyId, req.body);
  res.send(property);
});

const deleteProperty = catchAsync(async (req, res) => {
       // to work on deleting files
  await propertyService.deletePropertyById(req.params.propertyId);
  res.status(httpStatus.NO_CONTENT).json({'message': 'Property deleted successfully'});
});

module.exports = {
    createProperty,
    getProperties,
    getProperty,
    updateProperty,
    deleteProperty,
};
