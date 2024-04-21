const httpStatus = require('http-status');
const {ProductVariant, ProductMedia } = require('../models');
const ApiError = require('../utils/ApiError');
const path = require('path');
const fs = require('fs');


const createProductMedia = async (body) => {

  const newProductMedia = new ProductMedia(body);
  await newProductMedia.save();
  
  return newProductMedia;
};

const queryProductMedias = async (filter, options) => {
    // const productMedias = await ProductMedia.paginate(filter, options);
    const productMedias = await ProductMedia.find({});
    return productMedias;
  };

  const getProductMediaById = async (id) => {
    return ProductMedia.findById(id);
  };

  const updateProductMediaById = async (productMediaId, updateBody) => {

    const productMedia = await getProductMediaById(productMedia);
    if (!productMedia) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product Media not found');
    }

      
  
    Object.assign(productMedia, updateBody);
 
    await productMedia.save();
    return productMedia;
  };
  
  const deleteProductMediaById = async (productMediaId) => {
    const productMedia = await getProductMediaById(productMediaId);
    if (!productMediaId) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product Media not found');
    }
    await productMedia.remove();
    
  };

  

module.exports = {
    createProductMedia,
    queryProductMedias,
    getProductMediaById,
    updateProductMediaById,
    deleteProductMediaById
};
