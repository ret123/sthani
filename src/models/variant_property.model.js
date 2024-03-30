const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const variantPropertySchema = mongoose.Schema(
  {
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    variant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductVariant',
        required: true
    },
    property_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },
  
    value: {
        type: String,
    }   
   
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
variantPropertySchema.plugin(toJSON);
variantPropertySchema.plugin(paginate);

module.exports = mongoose.model('VariantProperty', variantPropertySchema);
