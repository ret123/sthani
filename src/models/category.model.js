const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
    },
    banner: {
      type: String,
      required: true,
      trim: true,
    },
  
    meta_title: {
      type: String,
      required: false,
      trim: true,
    },
    meta_description: {
        type: String,
        required: false,
        trim: true,
    },
    deleted_at: {
        type: Date,
        default: Date.now,
        required: false
    },
    products: [{ 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
  }]
   
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);
categorySchema.set('validateBeforeSave', false);

module.exports = mongoose.model('Category', categorySchema);
