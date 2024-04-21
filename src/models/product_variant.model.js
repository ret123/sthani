const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const productVariantSchema = mongoose.Schema(
  {
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    property_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: false
    }],
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    stock: {
      type: Number,
      default: 0,
      trim: true,
    },
   
    name: {
        type: String,
        required: true,
        // unique: true,
        trim: true
    },
    weight: {
        type: Number,
        required: false
    },
    length: {
        type: Number,
        required: false
    },
    width: {
        type: Number,
        required: false
    },
    height: {
        type: Number,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    discounted_price: {
        type: Number,
        required: false
    },
    sales_count: {
        type: Number,
        default: 0
    },
    published: {
        type: Boolean,
        default: 0
    },
   
   
    deleted_at: {
        type: Date,
        default: Date.now,
        required: false
    }
   
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
productVariantSchema.plugin(toJSON);
productVariantSchema.plugin(paginate);

module.exports = mongoose.model('ProductVariant', productVariantSchema);
