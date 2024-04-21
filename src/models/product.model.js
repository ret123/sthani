const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const generateSlug = require('../services/generateSlug');

const productSchema = mongoose.Schema({
    brand_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    sku: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description_short: {
        type: String,
        required: false,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    meta_title: {
        type: String,
        required: false,
        trim: true
    },
    meta_description: {
        type: String,
        required: false,
        trim: true
    },
    meta_keywords: {
        type: [String],
        required: false
    },
    additional_descriptions: {
        type: [
            {
                label: {
                  type: String,
                  required: false,
                },
                value: {
                  type: String,
                  required: false,
                },
              },
        ],
        required: false
    },
    additional_properties: {
        type: [
            {
                label: {
                  type: String,
                  required: false,
                },
                value: {
                  type: String,
                  required: false,
                },
              },
        ],
        required: false
    },
    weight: {
        type: Number,
        required: true
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
    quantity_default: {
        type: Number,
        default: 1
    },
    quantity_min: {
        type: Number,
        default: 1
    },
    quantity_max: {
        type: Number,
        required: false
    },
    stock: {
        type: Number,
        default: 0
    },
    review_rating: {
        type: Number,
        required: false
    },
    allow_out_of_stock_purchases: {
        type: Boolean,
        default: 0
        
    },
    price: {
        type: Number,
        required: true
    },
    discounted_price: {
        type: Number,
        required: false
    },
    price_includes_tax: {
        type: Boolean,
        default: 1
    },
    cost: {
        type: Number,
        required: false
    },
    published: {
        type: Boolean,
        default: 0
    },
    sales_count: {
        type: Number,
        default: 0
    },
    deleted_at: {
        type: Date,
        default: Date.now,
        required: false
    },
    categories: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }]
},
{
    timestamps: true
}
)

productSchema.pre('save', function(next) {
    if (!this.slug) {
        this.slug = generateSlug(this.name);
    }
    next();
  });
  

// add plugin that converts mongoose to json
productSchema.plugin(toJSON);
productSchema.plugin(paginate);

module.exports = mongoose.model('Product',productSchema);