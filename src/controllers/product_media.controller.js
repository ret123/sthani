const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { productMediaService } = require('../services');

const createProductMedia = catchAsync(async (req, res) => {
try {
  const productMedia = await productMediaService.createProductMedia(req.body);
  res.status(httpStatus.CREATED).send(productMedia);
} catch (err) {
    res.status(400).json({ message: err.message });
}
   

});

const getProductMedias = catchAsync(async (req, res) => {
  try {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await productMediaService.queryProductMedias(filter, options);
    // console.log(result)
    res.send(result);
  } catch(err) {
    res.status(400).json({ message: err.message });
  }


})

const getProductMedia = catchAsync(async (req, res) => {
  const productMedia = await productMediaService.getProductMediaById(req.params.productMediaId);
  if (!productMedia) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product Variant not found');
  }
  res.send(productMedia);
});

const updateProductMedia = catchAsync(async (req, res) => {
  const product = await productMediaService.updateProductMediaById(req.params.productMediaId, req.body);
  res.send(product);
});

const deleteProductMedia = catchAsync(async (req, res) => {
  await productMediaService.deleteProductMediaById(req.params.productMediaId);
  res.json({message: 'Product Media deleted successfully!'});
});



module.exports = {
    createProductMedia,
    getProductMedias,
    getProductMedia,
    updateProductMedia,
    deleteProductMedia
}