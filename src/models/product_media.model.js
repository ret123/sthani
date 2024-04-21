const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const productMediaSchema = mongoose.Schema(
  {
    disk_name: {
        type: String,
        required: true
    },
    file_name: {
        type: String,
        required: true
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    variant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductVariant',
        required: false
    },
    title: {
        type: String,
        required: true
    },
  
    filesize: {
        type: Number,
    },
    type: {
        type: String,
        required: true
    },
    sort_order: {
        type: Number,
        default: 0
    }   
   
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
productMediaSchema.plugin(toJSON);
productMediaSchema.plugin(paginate);

module.exports = mongoose.model('ProductMedia', productMediaSchema);
