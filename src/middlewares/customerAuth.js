const jwt = require('jsonwebtoken');
const { Customer } = require('../models'); 
const config = require('../config/config');

const authenticateToken = async (req, res, next) => {
 
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  try {
     const decoded = jwt.verify(token, config.jwt.secret);
    

    
    const customer = await Customer.findById(decoded.sub);
    
  
    if (!customer) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.customer = customer;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token invalid or expired' });
  }
};

module.exports = authenticateToken;
