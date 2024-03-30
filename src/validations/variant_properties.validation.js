const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createVariantProperties = {
  body: Joi.object().keys({
    product_id: Joi.string().custom(objectId).required(),
    variant_id: Joi.string().custom(objectId).required(),
    property_id: Joi.string().custom(objectId).required(),
    value: Joi.string().required()
  

  }),
};


const getVariantProperties = {
  query: Joi.object().keys({
    product_id: Joi.string().custom(objectId),
    variant_id: Joi.string().custom(objectId),
    property_id: Joi.string().custom(objectId),
    value: Joi.string()

    // sortBy: Joi.string(),
    // limit: Joi.number().integer(),
    // page: Joi.number().integer(),
  }),
};

const getVariantProperty = {
  params: Joi.object().keys({
    variantPropertyId: Joi.string().custom(objectId),
  }),
};

const updateVariantProperty = {
  params: Joi.object().keys({
    variantPropertyId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
        product_id: Joi.string().custom(objectId),
    variant_id: Joi.string().custom(objectId),
    property_id: Joi.string().custom(objectId),
    value: Joi.string()
    })
    .min(1),
};
const deleteVariantProperty = {
    params: Joi.object().keys({
        variantPropertyId: Joi.string().custom(objectId),
    }),
  };
  


module.exports = {
    createVariantProperties,
    getVariantProperties,
    getVariantProperty,
    updateVariantProperty,
    deleteVariantProperty
}


