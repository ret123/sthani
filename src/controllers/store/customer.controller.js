const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { Customer } = require('../../models');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const { updateProfileValidation } = require('../../validations/store/profile.validation');


const updateProfile = catchAsync(async (req, res) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token not provided' });
    } 
    const payload = jwt.verify(token, config.jwt.secret);
    
    const customer = await Customer.findById(payload.sub)

    try {
      const userId = customer._id; // Assuming you have access to the authenticated user's ID
      const schema = await updateProfileValidation(userId);
  
      // Validate request body against the generated schema
      const validationResult = schema.validate(req.body);
  
      if (validationResult.error) {
        // Handle validation error
        return res.status(400).json({
          status: 400,
          message: "Bad Request: Either email or mobile is required"
      }
      
      );
      }
  
      // Proceed with updating the user profile
       customer.first_name = req.body.first_name;
       customer.last_name = req.body.last_name;
       customer.dob = req.body.dob;
       customer.gender = req.body.gender
       if(customer.email) {
        customer.phone = req.body.phone
       } else {
        customer.email = req.body.email
       }
       const updatedCustomer = await customer.save();
      res.status(200).json({
        status: 200,
        message: "Profile updated successfully"
    }
    
    );
    } catch (error) {
      // Handle other errors
      if (error.code === 11000) {
        const duplicateKey = Object.keys(error.keyValue)[0];
        const duplicateValue = error.keyValue[duplicateKey];
        // res.json({message: `MongoDB validation error:  '${duplicateKey}' with value '${duplicateValue}' already exists.`});
        res.status(409).json({
          "status": 409,
          "message": "Conflict: Email or mobile already exists"
      })
  
    } else {
        res.json({message: "Unknown MongoDB validation error."});
    }
      // res.status(500).json({  error });
    }
    
  })

module.exports = {
    updateProfile
}