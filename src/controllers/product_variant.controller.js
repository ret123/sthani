const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { productVariantService } = require('../services');

const createProductVariant = catchAsync(async (req, res) => {
try {
  const productVariant = await productVariantService.createProductVariant(req.body);
  res.status(httpStatus.CREATED).send(productVariant);
} catch (err) {
    res.status(400).json({ message: err.message });
}
   

});

const getProductVariants = catchAsync(async (req, res) => {
  try {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await productVariantService.queryProductVariants(filter, options);
    // console.log(result)
    res.send(result);
  } catch(err) {
    res.status(400).json({ message: err.message });
  }


})

const getProductVariant = catchAsync(async (req, res) => {
  const productVariant = await productVariantService.getProductVariantById(req.params.productVariantId);
  if (!productVariant) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product Variant not found');
  }
  res.send(productVariant);
});

const updateProductVariant = catchAsync(async (req, res) => {
  const product = await productVariantService.updateProductVariantById(req.params.productVariantId, req.body);
  res.send(product);
});

const deleteProductVariant = catchAsync(async (req, res) => {
  await productService.deleteProductById(req.params.productVariantId);
  res.json({message: 'Product Variant deleted successfully!'});
});



module.exports = {
    createProductVariant,
    getProductVariants,
    getProductVariant,
    updateProductVariant,
    deleteProductVariant
}