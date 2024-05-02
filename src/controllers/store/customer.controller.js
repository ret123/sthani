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
      const userId = customer._id; 
      const schema = await updateProfileValidation(userId);
      const validationResult = schema.validate(req.body);
  
      if (validationResult.error) {
       
        return res.status(400).json({ error: validationResult.error.details[0].message });
      }

      if(req.body.mobile) {
        const existingUserWithPhone = await Customer.findOne({'mobile': req.body.mobile})
      
          if (existingUserWithPhone && existingUserWithPhone._id.toString() != userId.toString()) {
           
          return res.status(400).json({ status: 400, message : "Mobile number is already registered"});
          }
        
      }
      if(req.body.email) {
        const existingUserWithEmail = await Customer.findOne({'email': req.body.email})
        if (existingUserWithEmail && existingUserWithEmail._id.toString() != userId.toString()) {
          return res.status(400).json({ status: 400, message : "Email address is already registered"});
          }
      }
       
       customer.first_name = req.body.first_name;
       customer.last_name = req.body.last_name;
       customer.dob = req.body.dob;
       customer.gender = req.body.gender
    
        customer.mobile = req.body.mobile
 
        customer.email = req.body.email
      
       const updatedCustomer = await customer.save();
      res.status(200).json({
        status: 200,
        message: "Profile updated successfully"
    }
    
    );
    } catch (error) {
    
      if (error.code === 11000) {
        const duplicateKey = Object.keys(error.keyValue)[0];
        const duplicateValue = error.keyValue[duplicateKey];
        res.json({message: `MongoDB validation error:  '${duplicateKey}' with value '${duplicateValue}' already exists.`});
    } else {
        res.json({message: "Unknown MongoDB validation error."});
    }
      
    }
    
  })

module.exports = {
    updateProfile
}