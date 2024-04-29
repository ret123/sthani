const httpStatus = require('http-status');

const ApiError = require('../../utils/ApiError');
const { Customer } = require('../../models');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createCustomer = async ({email,phone}) => {
 
  try {
    if(email) {
      response = await Customer.findOne({email}).exec();
    }
    if(phone) {
      response = await Customer.findOne({phone}).exec();
    }
       
      if (response) {
       
        return res.status(404).json({
          
          message: "User already Exists"
        })
      } else {
        if(email) {
          return Customer.create({ email});
        }
        if(phone) {
          return Customer.create({ phone});
        }
        
        
      }
     
  } catch (err) {
    return err;
  }
};


const updateCustomer = async (body) => {
  const { email, phone } = body;
  try {
    let response;
    if (phone) {
      response = await Customer.findOne({'phone': phone}).exec();
    }
    if(email) {
      response = await Customer.findOne({'email': email}).exec();
    }
      if (response) {
        response.first_name = body.first_name;
        response.last_name = body.last_name;
        response.dob = body.dob;
        response.gender = body.gender;
        response.save();
        return response;
        
      } else {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Phone number or email does not exist');
      }
    
   
    }  catch (err) {
    return err;
  }
}

const queryCustomers = async (filter, options) => {
  // const brands = await Brand.paginate(filter, options);
  const customers = await Customer.find({});
  return customers;
};

const getUserByEmailOrPhone = async (result) => {
const {email,phone} = result

  try {
    let query;
    if (phone) {
        query = {phone};
    } else {
        query =  {email} ;
    }
  
    const customer = await Customer.findOne(query);
    console.log('customer:',customer)
    if (customer) {
      return customer
       
    } else {
        console.log('Customer not found');
    }
} catch (error) {
    console.error('Error finding user:', error);
}
 
}

module.exports = {
  createCustomer,
  updateCustomer,
  getUserByEmailOrPhone,
  queryCustomers
};
