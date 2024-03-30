const httpStatus = require('http-status');
const { Property } = require('../models');
const ApiError = require('../utils/ApiError');
const generateSlug = require('./generateSlug');
const { uploadSingleFile } = require('./fileUpload.service');


const createProperty = async (req) => {
 
    // const banner = uploadSingleFile(req.files.banner[0])
    
  
    const slug = generateSlug(req.body.name);
   
    const property = new Property({
      name: req.body.name,
      unit: req.body.unit,
      options: req.body.options,
      slug: slug
      
    })
    const newProperty = property.save()
    return newProperty;
    
};


const queryProperties = async (filter, options) => {
//   const categories = await Category.paginate(filter, options);
  return Property.find();
};


const getPropertyById = async (id) => {
  return Property.findById(id);
};



const updatePropertyById = async (propertyId, updateBody) => {
  const property = await getPropertyById(propertyId);
  if (!property) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Property not found');
  }
 
  Object.assign(property, updateBody);
  await property.save();
  return property;
};


const deletePropertyById = async (propertyId) => {
  const property = await getPropertyById(propertyId);
  if (!property) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Property not found');
  }
  await property.remove();
  return property;
};

module.exports = {
    createProperty,
    queryProperties,
    getPropertyById,
    updatePropertyById,
    deletePropertyById,
  
};
