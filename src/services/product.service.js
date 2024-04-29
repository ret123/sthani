const httpStatus = require('http-status');
const { Product, Brand } = require('../models');
const ApiError = require('../utils/ApiError');
const path = require('path');
const fs = require('fs');
const generateSlug = require('./generateSlug');

const createProduct = async (productBody) => {
  // console.log(productBody);
  try {
    const slug = generateSlug(productBody.name);

    const cats = productBody.category?.map(cat => {
      return cat.value
    })
    // console.log(productBody)
    let add_descriptions = []
    let add_properties = []
    const product = new Product({
      brand_id: productBody.brand_id,
      sku: productBody.sku,
      name: productBody.name,
      slug: slug,
      description_short: productBody.description_short,
      description: productBody.description,
      meta_title: productBody.meta_title,
      meta_description: productBody.meta_description,
      meta_keywords: productBody.meta_keywords,
    
      weight: productBody.weight,
      length: productBody.length,
      width: productBody.width,
      height: productBody.height,
      quantity_default: productBody.quantity_default,
      quantity_min: productBody.quantity_default,
      quantity_max: productBody.quantity_max,
      stock: productBody.stock,
      // reviews_rating: productBody.reviews_rating,
      allow_out_of_stock_purchase: productBody.allow_out_of_stock_purchase,
      price: productBody.price,
      discounted_price: productBody.discounted_price,
      price_includes_tax: productBody.price_includes_tax,
      cost: productBody.cost,
      published: productBody.published,
      categories: cats
      // sales_count to be calculated
  
    })
    if(typeof productBody.additional_descriptions !== 'undefined' && productBody.additional_descriptions.length > 0) {
      productBody.additional_descriptions.map((doc,index) => {
          add_descriptions.push({label:doc.label,value: doc.value })
      })
  }

  if(typeof productBody.additional_properties !== 'undefined' && productBody.additional_properties.length > 0) {
      productBody.additional_properties.map((doc,index) => {
          add_properties.push({label:doc.label,value: doc.value })
      })
  }
  product.additional_descriptions = add_descriptions;
  product.additional_properties = add_properties;
     product.save();
    
    return product

  } catch (err) {
     return err
  }
 
 
};

const queryProducts = async (filter, options) => {
    // const brands = await Brand.paginate(filter, options);
    const products = await Product.find({});
    return products;
  };

  const getProductById = async (id) => {
    const product = await Product.findById(id).exec();
    // const brand = await Brand.findById(product.brand_id);
    // console.log(brand);
    //  console.log(product);
    return product
  };

  const updateProductById = async (productId, productBody) => {
    

  console.log("Product" + productBody);

    try {
      let product = await getProductById(productId);
      // console.log(product)
      if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
      }
      const slug = generateSlug(productBody.name);
     
  
      const cats = productBody.category?.map(cat => {
        return cat.value
      })
      
        product.brand_id = productBody.brand_id,
     
        product.sku =  productBody.sku,
        product.name = productBody.name,
        product.slug = slug,
        product.description_short = productBody.description_short,
        product.description = productBody.description,
        product.meta_title = productBody.meta_title,
        product.meta_description = productBody.meta_description,
        product.meta_keywords = productBody.meta_keywords,
        product.additional_properties = productBody.additional_properties,
        product.weight = productBody.weight,
        product.length = productBody.length,
        product.width = productBody.width,
        product.height = productBody.height,
        product.quantity_default = productBody.quantity_default,
        product.quantity_min = productBody.quantity_default,
        product.quantity_max = productBody.quantity_max,
        product.stock = productBody.stock,
        // reviews_rating: productBody.reviews_rating,
        product.allow_out_of_stock_purchase = productBody.allow_out_of_stock_purchase,
        product.price = productBody.price,
        product.discounted_price = productBody.discounted_price,
        // price_includes_tax: productBody.price_includes_tax,
        product.cost = productBody.cost,
        product.published = productBody.published,
        product.categories = cats
        // sales_count to be calculated
        // console.log(product)
       
        let add_discriptions = [];
        let add_properties = [];
        console.log(productBody.addtional_description);
        
        if(typeof productBody.additional_descriptions !== 'undefined' && productBody.additional_descriptions.length > 0) {
            productBody.additional_descriptions?.map((doc,index) => {
                add_discriptions.push({label:doc.label,value: doc.value })
            })
            product.additional_descriptions = add_discriptions;
        }
    
        if(typeof productBody.additional_properties !== 'undefined' && productBody.additional_properties.length > 0) {
            productBody.additional_properties?.map((doc,index) => {
                add_properties.push({label:doc.label,value: doc.value })
            })
            product.additional_properties = add_properties;
            // console.log(product.additional_properties)
    
        }
       
      
      
      //  console.log(product)
      await product.save();
      
       return product
  
    } catch (err) {
       return err
    }
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
