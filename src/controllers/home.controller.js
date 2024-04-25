const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');


const createHome = catchAsync(async (req, res) => {
   
//   console.log(req.body)
//   console.log(req.files.logo[0].filepath)
try {
  const home = await homeService.createHome(req);
  res.status(httpStatus.CREATED).send(home);
} catch (err) {
    res.status(400).json({ message: err.message });
}
   

});
 

module.exports = {
    createHome,
   
}