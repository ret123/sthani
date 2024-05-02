const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const customerSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
    },
    mobile: {
      type: Number,
      required: false,
      trim: true,
      index: true,
  },
    email: {
        type: String,
        required: false,
        index: true,
        trim: true,
        lowercase: true,
        validate(value) {
          if (!validator.isEmail(value)) {
            throw new Error('Invalid email');
          }
        },
      },
    
      dob: {
        type: String,
        trim: true,
        required: true
      },
      gender: {
        type: String,
        trim: true,
        required: false
      }
    
  },
  {
    timestamps: true,
  }
);

// Custom validation for uniqueness of phone number
customerSchema.path('mobile').validate(async function(value) {
  if (value === null) return true; // Allow null values
  const existingCustomer = await this.constructor.findOne({ mobile: value });
  return !existingCustomer || existingCustomer._id.equals(this._id);
}, 'Mobile number must be unique.');

// Custom validation for uniqueness of email
customerSchema.path('email').validate(async function(value) {
  if (value === null) return true; // Allow null values
  const existingCustomer = await this.constructor.findOne({ email: value });
  return !existingCustomer || existingCustomer._id.equals(this._id);
}, 'Email must be unique.');

// add plugin that converts mongoose to json
customerSchema.plugin(toJSON);
customerSchema.plugin(paginate);
customerSchema.set('validateBeforeSave', false);

customerSchema.statics.isEmailTaken = async function (email, excludeCustomerId) {
  const customer = await this.findOne({ email, _id: { $ne: excludeCustomerId } });
  return !!customer;
};

customerSchema.pre('save', async function (next) {
  const customer = this;
  if (customer.isModified('password')) {
    customer.password = await bcrypt.hash(customer.password, 8);
  }
  next();
});

module.exports = mongoose.model('Customer', customerSchema);
