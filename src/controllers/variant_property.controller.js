const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { variantPropertyService } = require('../services');

const createVariantProperties = catchAsync(async (req, res) => {
try {
  const variantProperty = await variantPropertyService.createVariantProperties(req.body);
  res.status(httpStatus.CREATED).send(variantProperty);
} catch (err) {
    res.status(400).json({ message: err.message });
}
   

});

const getVariantProperties = catchAsync(async (req, res) => {
  try {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await variantPropertyService.queryVariantProperties(filter, options);
    // console.log(result)
    res.send(result);
  } catch(err) {
    res.status(400).json({ message: err.message });
  }


})

const getVariantProperty = catchAsync(async (req, res) => {
  const variantProperty = await productVariantService.getProductVariantById(req.params.variantPropertyId);
  if (!variantProperty) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Variant Property not found');
  }
  res.send(variantProperty);
});

const updateVariantProperty = catchAsync(async (req, res) => {
  const variantProperty = await variantPropertyService.updateVariantPropertyById(req.params.variantPropertyId, req.body);
  res.send(variantProperty);
});

const deleteVariantProperty = catchAsync(async (req, res) => {
  await variantPropertyService.deleteVariantPropertyById(req.params.variantPropertyId);
  res.json({message: ' Variant property deleted successfully!'});
});



module.exports = {
    createVariantProperties,
    getVariantProperties,
    getVariantProperty,
    updateVariantProperty,
    deleteVariantProperty
}