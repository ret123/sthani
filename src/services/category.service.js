const httpStatus = require('http-status');
const fs = require('fs');
const path = require('path');
const { Category } = require('../models');
const ApiError = require('../utils/ApiError');
const generateSlug = require('./generateSlug');
const { uploadSingleFile } = require('./fileUpload.service');


const createCategory = async (req) => {

     console.log(req.files)
 
    const banner = uploadSingleFile(req.files.banner)
    
  
    const slug = generateSlug(req.body.name);
   
    const category = new Category({
      name: req.body.name,
      code: req.body.code,
      banner: banner,
      meta_title: req.body.meta_title,
      meta_description: req.body.meta_description,
      slug: slug
      
    })
    const newCategory = category.save()
    return newCategory;
    
};


const queryCategories = async (filter, options) => {
//   const categories = await Category.paginate(filter, options);
  return Category.find();
};


const getCategoryById = async (id) => {
  return Category.findById(id);
};



const updateCategoryById = async (req,categoryId, updateBody) => {
   console.log(updateBody)
  console.log(categoryId)
  console.log(req.files)
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }


  if( Object.keys(req.files).length !== 0 && typeof req.files === 'object') {
    console.log(req.files);
    const banner = uploadSingleFile(req.files.banner)
    category.banner =  banner;
  } else {
    updateBody.banner = category.banner
  }

  Object.assign(category, updateBody);
 
 
 
  
  await category.save();

  return category;
};


const deleteCategoryById = async (categoryId) => {
  const category = await getCategoryById(categoryId);

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  const imageName = category.banner; 

  // Construct the path to the image file
  const imagePath = path.join(__dirname, '../uploads', imageName);

  // Delete the image file from the file system
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error('Error deleting image:', err);
      return res.status(500).json({ error: 'Failed to delete image' });
    }
  })
 
  await category.remove();
  return category;
};


module.exports = {
    createCategory,
    queryCategories,
    getCategoryById,
    updateCategoryById,
    deleteCategoryById,
  
};
