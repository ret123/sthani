const jwt = require('jsonwebtoken');
const { Customer } = require('../models'); 
const config = require('../config/config');

const authenticateToken = async (req, res, next) => {
  // Get the JWT token from the request headers
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Check if the user exists in the database
    const customer = await Customer.findById(decoded.sub);
    // console.log(customer)
    if (!customer) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Attach the user object to the request for further use
    req.customer = customer;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token invalid or expired' });
  }
};

module.exports = authenticateToken;
