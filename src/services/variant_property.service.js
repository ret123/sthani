const httpStatus = require('http-status');
const { VariantProperty } = require('../models');
const ApiError = require('../utils/ApiError');


const createVariantProperties = async (userBody) => {
  
  return VariantProperty.create(userBody);
};


const queryVariantProperties = async (filter, options) => {
//   const variantProperty = await VariantProperty.paginate(filter, options);

const variantProperty = VariantProperty.find()
  return variantProperty;
};


const getVariantPropertyById = async (id) => {
  return VariantProperty.findById(id);
};




const updateVariantPropertyById = async (variantPropertyId, updateBody) => {
  const variantProperty = await getVariantPropertyById(variantPropertyId);
  if (!variantProperty) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Variant property not found');
  }
 
  Object.assign(variantProperty, updateBody);
  await variantProperty.save();
  return variantProperty;
};


const deleteVariantPropertyById = async (variantPropertyId) => {
  const variantProperty = await getVariantPropertyById(userId);
  if (!variantProperty) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Variant property not found');
  }
  await variantProperty.remove();
  return variantProperty;
};

module.exports = {
    createVariantProperties,
    queryVariantProperties,
    getVariantPropertyById,
    updateVariantPropertyById,
    deleteVariantPropertyById,
 
};
