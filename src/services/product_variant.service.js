const httpStatus = require('http-status');
const {ProductVariant, Property } = require('../models');
const ApiError = require('../utils/ApiError');
const path = require('path');
const fs = require('fs');
const generateSlug = require('./generateSlug');

const createProductVariant = async (variant,product,variants) => {

  try {
    const slug = generateSlug(product.name + ' ' + variant.variantName);
  const newProductVariant = new ProductVariant({
    product_id: product._id,
    property_id: variants,
    slug: slug,
    sku: variant.variantSKU,
    stock: variant.variantStock,
    name: variant.variantName,
    price: variant.variantPrice,
    discounted_price: variant.variantDiscountedPrice,
    published: product.published

  });

  // console.log(newProductVariant);
   const prod = await newProductVariant.save();
  return prod;

  } catch(err) {
    return err
  }
  
  
  // 

  // console.log(newProduct)
  // return newProductVariant;
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
