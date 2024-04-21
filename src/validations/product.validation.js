const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createProduct = {
  body: Joi.object().keys({
    brand_id: Joi.string().custom(objectId),
    name: Joi.string().required(),
    sku: Joi.string().required(),
    // slug: Joi.string().required(),
    description_short: Joi.string(),
    // logo: Joi.string().required(),
    description: Joi.string(),
    meta_title: Joi.string(),
    meta_description: Joi.string(),
    short_description: Joi.string(),
    meta_keywords: Joi.array(),
    additional_descriptions: Joi.array().items(
      Joi.object({
        label: Joi.string(),
        value: Joi.string(),
      })
    ),
    additional_properties: Joi.array().items(
      Joi.object({
        label: Joi.string(),
        value: Joi.string(),
      })
    ),
    weight: Joi.number().required(),
    height: Joi.number(),
    length: Joi.number(),
    width: Joi.number(),
    quantity_default: Joi.number().default(1),
    quantity_min: Joi.number().default(1),
    quantity_max: Joi.number(),
    stock: Joi.number().default(0),
    reviews_rating: Joi.number(),
    allow_out_of_stock_purchase: Joi.boolean(),
    price: Joi.number().required(),
    discounted_price: Joi.number(),
    price_includes_tax: Joi.boolean(),
    cost: Joi.number(),
    published: Joi.boolean(),
    sales_count: Joi.number().default(0),
    category: Joi.array().items(
      Joi.object({
        label: Joi.string(),
        value: Joi.string(),
      })
    ),
    variants: Joi.array().items(
      Joi.object({
        name: Joi.string(),
        options: Joi.array(),
        customName: Joi.string().allow(''),
      })
    ),
    productVariant: Joi.array().items(
      Joi.object({
        image: Joi.any().optional().allow(null),
        variantName: Joi.string(),
        variantPrice: Joi.number().required(),
        variantSKU: Joi.string(),
        variantStock: Joi.number().required(),
        variantDiscountedPrice: Joi.number().optional().allow(null),
      })
    ),
  })
  .options({ allowUnknown: true }),
};

const getProducts = {
  query: Joi.object().keys({
    brand_id: Joi.string().custom(objectId),
    name: Joi.string(),
    sku: Joi.string(),
    // slug: Joi.string().required(),
    description_short: Joi.string(),
    // logo: Joi.string().required(),
    description: Joi.string(),
    meta_title: Joi.string(),
    meta_description: Joi.string(),
    meta_keywords: Joi.array(),
    additional_descriptions: Joi.array().items(
      Joi.object({
        label: Joi.string(),
        value: Joi.string(),
      })
    ),
    additional_properties: Joi.array().items(
      Joi.object({
        label: Joi.string(),
        value: Joi.string(),
      })
    ),
    weight: Joi.number(),
    height: Joi.number(),
    length: Joi.number(),
    width: Joi.number(),
    quantity_default: Joi.number().default(1),
    quantity_min: Joi.number().default(1),
    quantity_max: Joi.number(),
    stock: Joi.number().default(0),
    reviews_rating: Joi.number(),
    allow_out_of_stock_purchase: Joi.boolean(),
    price: Joi.number(),
    discounted_price: Joi.number(),
    price_includes_tax: Joi.boolean(),
    cost: Joi.number(),
    published: Joi.boolean(),
    sales_count: Joi.number().default(0),
  }),
};

const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      brand_id: Joi.string().custom(objectId),
      name: Joi.string(),
      sku: Joi.string(),
      // slug: Joi.string().required(),
      description_short: Joi.string(),
      // logo: Joi.string().required(),
      description: Joi.string(),
      meta_title: Joi.string(),
      meta_description: Joi.string(),
      meta_keywords: Joi.array(),
      additional_descriptions: Joi.array().items(
        Joi.object({
          label: Joi.string(),
          value: Joi.string(),
        })
      ),
      additional_properties: Joi.array().items(
        Joi.object({
          label: Joi.string(),
          value: Joi.string(),
        })
      ),
      weight: Joi.number(),
      height: Joi.number(),
      length: Joi.number(),
      width: Joi.number(),
      quantity_default: Joi.number().default(1),
      quantity_min: Joi.number().default(1),
      quantity_max: Joi.number(),
      stock: Joi.number().default(0),
      reviews_rating: Joi.number(),
      allow_out_of_stock_purchase: Joi.boolean(),
      price: Joi.number(),
      discounted_price: Joi.number(),
      price_includes_tax: Joi.boolean(),
      cost: Joi.number(),
      published: Joi.boolean(),
      sales_count: Joi.number().default(0),
      category: Joi.array().items(
       
      ),
      productVariant: Joi.array().items(
        Joi.object({
          image: Joi.any().optional().allow(null),
          variantName: Joi.string(),
          variantPrice: Joi.number().required(),
          variantSKU: Joi.string(),
          variantStock: Joi.number().required(),
          variantDiscountedPrice: Joi.number().optional().allow(null),
        })
      ),
    
    })
    .min(1).options({ allowUnknown: true }),
   
};

const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
