const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const generateSlug = require('../services/generateSlug');

const homeSchema = mongoose.Schema(
  {
    placement_id: {
      type: String,
      required: true,
    //   unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      required: false,
      trim: true,
    },
    widget_type: {
      type: String,
      required: true,
      trim: true,
    },
    items: {
      type: [
        {
          image: {
            type: String,
            required: true,
          },
          description: {
            type: String,
            required: false,
          },
          tag: {
            type: String,
            required: false
          },
          link: {
            type: {
                destination: {
                    type: String,
                    required: true
                },
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true
                }
            },
            required: false
          },
          brand: {
            type: mongoose.Schema.Types.ObjectId,
            required: false
          },
          categories: {
            type: mongoose.Schema.Types.ObjectId,
            required: false
          }
        },
      ],
     
    },
   
  },
  {
    timestamps: true,
  }
);



// add plugin that converts mongoose to json
homeSchema.plugin(toJSON);
homeSchema.plugin(paginate);

module.exports = mongoose.model('Home', homeSchema);
