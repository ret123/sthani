const httpStatus = require('http-status');
const { User, Brand } = require('../models');
const ApiError = require('../utils/ApiError');
const path = require('path');
const fs = require('fs');
const { uploadSingleFile, uploadMultipleFile } = require('./fileUpload.service');
const generateSlug = require('./generateSlug');
const formidable = require('formidable');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createBrand = async (req) => {
  //  console.log(req.files.logo)
  //  console.log(req.body)
  // const labelCount = req.files['images[]'].length
  // console.log(req.body.labels);
  const logo = uploadSingleFile(req.files.logo);
  const images = uploadMultipleFile(req.files['images[]'], req.body.labels);

  // console.log(images)

  const slug = generateSlug(req.body.name);

  const brand = new Brand({
    name: req.body.name,
    description: req.body.description,
    website: req.body.website,
    logo: logo,
    images: images,
    slug: slug,
  });
  const newBrand = brand.save();
  return newBrand;

  // return User.create(userBody);
};

const queryBrands = async (filter, options) => {
  // const brands = await Brand.paginate(filter, options);
  const brands = await Brand.find({});
  return brands;
};

const getBrandById = async (id) => {
  return Brand.findById(id);
};

// function to add images to images array
const addImagesToArray = async (brandId, newImagesArray) => {
  try {
    const updatedBrand = await Brand.findByIdAndUpdate(
      brandId,
      { $push: { images: { $each: newImagesArray } } },
      { new: true }
    );

    console.log('Updated brand with new images:', updatedBrand);
    return updatedBrand;
  } catch (error) {
    console.error('Error updating images:', error);
    throw error;
  }
};

// function to get image from brand table
const getImageById = async (brandId, imageIdToFind) => {
  try {
    const brand = await Brand.findById(brandId);
    if (!brand) {
      // console.log('Brand not found');
      return null;
    }

    const image = brand.images.find((image) => image._id.toString() === imageIdToFind.toString());
    if (!image) {
      // console.log('Image not found');
      return null;
    }

    // console.log('Found image:', image);
    return image;
  } catch (error) {
    // console.error('Error getting image:', error);
    throw error;
  }
};

// function to remove a image object
const removeImageById = async (brandId, imageIdToRemove) => {
  try {
    const updatedBrand = await Brand.findByIdAndUpdate(
      brandId,
      { $pull: { images: { _id: imageIdToRemove } } },
      { new: true }
    );

    // console.log('Updated brand:', updatedBrand);
    return updatedBrand;
  } catch (error) {
    // console.error('Error removing image:', error);
    throw error;
  }
};

const updateBrandById = async (brandId, req) => {
  // delete image from database and uploads directory

  if (req.body.deletedImages?.length > 0) {
    try {
      req.body.deletedImages?.map(async (imageId) => {
        const image = await getImageById(brandId, imageId);

        const imageName = image.value;
        // console.log(imageName)
        const imagePath = path.join(__dirname, '../uploads', imageName);
        // console.log(imagePath);

        // Delete the image file from the file system
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error('Error deleting image:', err);
            return res.status(500).json({ error: 'Failed to delete image' });
          }
        });
        const updatedBrand = await removeImageById(brandId, imageId);
        // console.log(updatedBrand);
      });
    } catch (err) {
      throw err;
    }
  }

  // update brand model

  const brand = await getBrandById(brandId);
  if (!brand) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Brand not found');
  }

  let logo = brand.logo;
  let images = [];

  //  console.log(req.files)
  
 
  if (req.files.logo) {
    logo = uploadSingleFile(req.files.logo);
    brand.logo =  logo
  }
 
  // if(typeof  req.files['images[]'] === 'Object' && req.files['images[]'] !== null) {
  //   req.files['images[]'] =  [req.files['images[]']] 
  //  console.log(true)
  //  console.log(req.files['images[]'])
  // } else {
  //   console.log('false')
  // }
  // console.log(req.files['images[]'])
  if(!Array.isArray( req.files['images[]'] ) && req.files['images[]'] !== null && typeof req.files['images[]'] !== 'undefined') {
    // images = uploadMultipleFile(req.files['images[]'], req.body.labels);
    // // console.log(images);
    // const updatedImagesArray = await addImagesToArray(brandId,images)
    req.files['images[]'] =  [req.files['images[]']] 
    console.log(true)
  } else {
    console.log('false')
  }
  
   
  // console.log(req.files)



  if (typeof req.files['images[]'] !== 'undefined' &&  req.files['images[]'] !== null) {
    
    // console.log(req.files['images[]'])
    images = uploadMultipleFile(req.files['images[]'], req.body.labels);
    // console.log(images);
    const updatedImagesArray = await addImagesToArray(brandId,images)
    // console.log(updatedImagesArray)
  }


  

  const slug = generateSlug(req.body.name);

  brand.name = req.body.name
  
  brand.description = req.body.description 
  brand.website =  req.body.website
  
  brand.slug = slug
  await brand.save()

  return brand;

  //  console.log(req.body)
  //  console.log(req.files)
  // const images = Object.keys(req.files).map((key) => {
  //   const matches = key.match(/\[(\d+)\]/); // Extract index from key
  //   if (matches && matches[1]) {
  //     const index = parseInt(matches[1]); // Parse index as integer
  //     return { index, filename: req.files[key] }; // Return image object
  //   }
  //   return null;
  // });
  // images.map(image => {
  //   console.log(image.filename)
  // })
  // let logo;
  // let images = [];
  // if(req.files.logo[0]) {
  //   logo = uploadSingleFile(req.files.logo[0])
  // }
  // if(req.files.images) {
  //   images = uploadMultipleFile(req.files.images)
  // }

  // const brand = await getBrandById(brandId);
  // if (!brand) {
  //   throw new ApiError(httpStatus.NOT_FOUND, 'Brand not found');
  // }

  // Object.assign(brand, updateBody);
  // await brand.save();
  // return brand;
};

// return User.create(userBody);

const deleteBrandById = async (brandId) => {
  const brand = await getBrandById(brandId);
  // console.log(brand)

  if (!brand) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Brand not found');
  }
  const logo = brand.logo;

  // Construct the path to the image file
  const imagePath = path.join(__dirname, '../uploads', logo);

  // Delete the image file from the file system
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error('Error deleting image:', err);
      return res.status(500).json({ error: 'Failed to delete image' });
    }
  });

  const images = brand.images;
  images.map((image) => {
    const imageName = image.value;
    const imagePath = path.join(__dirname, '../uploads', imageName);

    // Delete the image file from the file system
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error('Error deleting image:', err);
        return res.status(500).json({ error: 'Failed to delete image' });
      }
    });
  });

  await brand.remove();
  return brand;
};

module.exports = {
  createBrand,
  queryBrands,
  getBrandById,
  updateBrandById,
  deleteBrandById,
};
