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
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
          if (!validator.isEmail(value)) {
            throw new Error('Invalid email');
          }
        },
      },
      password: {
        type: String,
        // required: true,
        trim: true,
        // minlength: 8,
        // validate(value) {
        //   if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        //     throw new Error('Password must contain at least one letter and one number');
        //   }
        // },
        private: true, // used by the toJSON plugin
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
