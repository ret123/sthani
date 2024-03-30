const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { productService } = require('../services');
const { Brand } = require('../models');

const createProduct = catchAsync(async (req, res) => {
try {
  const product = await productService.createProduct(req.body);
  res.status(httpStatus.CREATED).send(product);
} catch (err) {
    res.status(400).json({ message: err.message });
}
   

});

const getProducts = catchAsync(async (req, res) => {
  try {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await productService.queryProducts(filter, options);
    // console.log(result)
    res.send(result);
  } catch(err) {
    res.status(400).json({ message: err.message });
  }


})

const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
   const brand = await Brand.findById(product.brand_id);
   
  res.send({"product": product, "brand": brand});
});

const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProductById(req.params.productId, req.body);
  res.send(product);
});

const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProductById(req.params.productId);
  res.status(httpStatus.NO_CONTENT).json({message: 'Product deleted successfully!'});
});



module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
}