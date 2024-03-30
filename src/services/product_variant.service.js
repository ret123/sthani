const httpStatus = require('http-status');
const {ProductVariant } = require('../models');
const ApiError = require('../utils/ApiError');
const path = require('path');
const fs = require('fs');
const generateSlug = require('./generateSlug');

const createProductVariant = async (productBody) => {
  const slug = generateSlug(productBody.name);
  const newProductVariant = new ProductVariant(productBody);
  newProductVariant.slug = slug;
  newProductVariant.save();

  // console.log(newProduct)
  return newProductVariant;
};

const queryProductVariants = async (filter, options) => {
    // const brands = await Brand.paginate(filter, options);
    const productVariants = await ProductVariant.find({});
    return productVariants;
  };

  const getProductVariantById = async (id) => {
    return ProductVariant.findById(id);
  };

  const updateProductVariantById = async (productVariantId, updateBody) => {

    const productVariant = await getProductVariantById(productVariantId);
    if (!productVariant) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product Variant not found');
    }

      
  
    Object.assign(productVariant, updateBody);
 
    await productVariant.save();
    return productVariant;
  };
  
  const deleteProductVariantById = async (productVariantId) => {
    const productVariant = await getProductVariantById(productVariantId);
    if (!productVariant) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product Variant not found');
    }
    await productVariant.remove();
    
  };

  

module.exports = {
    createProductVariant,
    queryProductVariants,
    getProductVariantById,
    updateProductVariantById,
    deleteProductVariantById
};
