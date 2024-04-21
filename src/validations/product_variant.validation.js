const Joi = require('joi');
const {objectId } = require('./custom.validation');

const createProductVariant = {
  body: Joi.object().keys({
    product_id: Joi.string().custom(objectId),
    property_id: Joi.array().items(
     
        Joi.string().custom(objectId),
      
    ),
    name: Joi.string().required(),
    sku: Joi.string().required(),
    // slug: Joi.string().required(),
    stock: Joi.number().default(0),
    weight: Joi.number(),
    height: Joi.number(),
    length: Joi.number(),
    width:  Joi.number(),
    price: Joi.number().required(),
    discounted_price: Joi.number(),
    // price_includes_tax: Joi.boolean(),
    published: Joi.boolean(),
    sales_count: Joi.number().default(0),

  }),
};

const getProductVariants = {
    query: Joi.object().keys({
    product_id: Joi.string().custom(objectId),
    name: Joi.string(),
    sku: Joi.string(),
    // slug: Joi.string().required(),

  
    weight: Joi.number(),
    height: Joi.number(),
    length: Joi.number(),
    width: Joi.number(),
  
    stock: Joi.number(),
 
    price: Joi.number(),
    discounted_price: Joi.number(),
    
    published: Joi.boolean(),
    sales_count: Joi.number().default(0),
    }),
  };

  const getProductVariant = {
    params: Joi.object().keys({
      productVariantId: Joi.string().custom(objectId),
    }),
  };

  const updateProductVariant = {
    params: Joi.object().keys({
        productVariantId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
      .keys({
    name: Joi.string(),
    sku: Joi.string(),
    // slug: Joi.string().required(),

    weight: Joi.number(),
    height: Joi.number(),
    length: Joi.number(),
 
    stock: Joi.number().default(0),
 
    price: Joi.number(),
    discounted_price: Joi.number(),

    published: Joi.boolean(),
    sales_count: Joi.number().default(0),
      })
      .min(1),
  };

  const deleteProductVariant = {
    params: Joi.object().keys({
      productVariantId: Joi.string().custom(objectId),
    }),
  };
  
  


module.exports = {
    createProductVariant,
    getProductVariants,
    getProductVariant,
    updateProductVariant,
    deleteProductVariant
}


