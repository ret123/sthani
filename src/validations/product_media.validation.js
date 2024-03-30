const Joi = require('joi');
const {objectId } = require('./custom.validation');

const createProductMedia = {
  body: Joi.object().keys({
    disk_name: Joi.string().required(),
    file_name: Joi.string().required(),
    product_id: Joi.string().custom(objectId),
    variant_id: Joi.string().custom(objectId),
    title: Joi.string().required(),
    filesize: Joi.number().required(),
    type: Joi.string().required(),
    sort_order: Joi.number().default(0),

  }),
};

const getProductMedias = {
    query: Joi.object().keys({
        disk_name: Joi.string(),
        file_name: Joi.string(),
        product_id: Joi.string(),
        variant_id: Joi.string(),
        title: Joi.string(),
        filesize: Joi.number(),
        type: Joi.string(),
        sort_order: Joi.number(),
  
    
    }),
  };

  const getProductMedia = {
    params: Joi.object().keys({
      productMediaId: Joi.string().custom(objectId),
    }),
  };

  const updateProductMedia = {
    params: Joi.object().keys({
        productMediaId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
      .keys({
        disk_name: Joi.string(),
        file_name: Joi.string(),
        product_id: Joi.string(),
        variant_id: Joi.string(),
        title: Joi.string(),
        filesize: Joi.number(),
        type: Joi.string(),
        sort_order: Joi.number(),
 
   
      })
      .min(1),
  };

  const deleteProductMedia = {
    params: Joi.object().keys({
        productMediaId: Joi.string().custom(objectId),
    }),
  };
  
  


module.exports = {
    createProductMedia,
    getProductMedias,
    getProductMedia,
    updateProductMedia,
    
    deleteProductMedia
}


