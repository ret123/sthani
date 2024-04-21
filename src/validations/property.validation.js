const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createProperty = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    // slug: Joi.string().required(),
    unit: Joi.string().required(),
   
    options: Joi.array().required(),
  

  }).options({ allowUnknown: true })
};


const getProperties = {
  query: Joi.object().keys({
    name: Joi.string(),
    // slug: Joi.string().required(),
    unit: Joi.string(),
   
    options: Joi.array(),

    // sortBy: Joi.string(),
    // limit: Joi.number().integer(),
    // page: Joi.number().integer(),
  }),
};

const getProperty = {
  params: Joi.object().keys({
    propertyId: Joi.string().custom(objectId),
  }),
};

const updateProperty = {
  params: Joi.object().keys({
    propertyId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
        name: Joi.string(),
        // slug: Joi.string().required(),
        unit: Joi.string().optional().allow(null,''),
       
        options: Joi.array(),
    })
    .min(1)
    .options({ allowUnknown: true }),
};
const deleteProperty = {
    params: Joi.object().keys({
        propertyId: Joi.string().custom(objectId),
    }),
  };
  


module.exports = {
    createProperty,
    getProperties,
    getProperty,
    updateProperty,
    deleteProperty
}


