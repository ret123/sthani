const httpStatus = require('http-status');
const { Product, Brand } = require('../models');
const ApiError = require('../utils/ApiError');
const path = require('path');
const fs = require('fs');
const generateSlug = require('./generateSlug');

const createProduct = async (productBody) => {
  const slug = generateSlug(productBody.name);
  const newProduct = new Product(productBody);
  newProduct.slug = slug;
  newProduct.save();

  // console.log(newProduct)
  return newProduct;
};

const queryProducts = async (filter, options) => {
    // const brands = await Brand.paginate(filter, options);
    const products = await Product.find({});
    return products;
  };

  const getProductById = async (id) => {
    const product = await Product.findById(id);
    // const brand = await Brand.findById(product.brand_id);
    // console.log(brand);
    //  console.log(product);
    return product
  };

  const updateProductById = async (productId, updateBody) => {

    const product = await getProductById(productId);
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }

    let add_discriptions = [];
    let add_properties = [];
    
    if(updateBody.additional_descriptions.length > 0) {
        updateBody.additional_descriptions.map((doc,index) => {
            add_discriptions.push({label:doc.label,value: doc.value })
        })
    }

    if(updateBody.additional_properties.length > 0) {
        updateBody.additional_properties.map((doc,index) => {
            add_properties.push({label:doc.label,value: doc.value })
        })
    }

   
  
    Object.assign(product, updateBody);
    product.additional_descriptions = add_discriptions;
    product.additional_properties = add_properties;
    await product.save();
    return product;
  };
  
  const deleteProductById = async (productId) => {
    const product = await getProductById(productId);
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    await product.remove();
    
  };

  

module.exports = {
  createProduct,
  queryProducts,
  getProductById,
  updateProductById,
  deleteProductById
};
