const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const propertySchema = mongoose.Schema(
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
    unit: {
      type: String,
      required: false,
      trim: true,
    },
   
    options: {
        type: [String],
        required: false
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
propertySchema.plugin(toJSON);
propertySchema.plugin(paginate);

module.exports = mongoose.model('Property', propertySchema);
