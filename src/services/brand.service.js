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
   console.log(req.body.labels);
   const logo = uploadSingleFile(req.files.logo)
   const images = uploadMultipleFile(req.files['images[]'],req.body.labels)

  // console.log(images)

  const slug = generateSlug(req.body.name);
 
  const brand = new Brand({
    name: req.body.name,
    description: req.body.description,
    website: req.body.website,
    logo: logo,
    images: images,
    slug: slug
    
  })
  const newBrand = brand.save()
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

const updateBrandById = async (brandId, req) => {
 
  // const form = new formidable.IncomingForm({multiples: true});

  // form.parse(req, (err, fields, files) => {
  //     if (err) {
  //         return res.status(500).json({ error: 'Failed to parse form data' });
  //     }

  //     const parsedData = {};
  //     for (const fieldName in fields) {
  //         // Split the field name by square brackets to extract keys
  //         const keys = fieldName.replace(/\]/g, '').split(/\[/).filter(Boolean);
          
  //         let target = parsedData;
  //         for (let i = 0; i < keys.length - 1; i++) {
  //           const key = keys[i];
  //           target[key] = target[key] || {};
  //           target = target[key];
  //         }
    
  //         // Set the value in the parsed data object
  //         const lastKey = keys[keys.length - 1];
  //         target[lastKey] = fields[fieldName][0]; // Assuming single value for simplicity
  //       }
    
  //       console.log(parsedData);
  //   })

  // console.log(req.body)
  // console.log(req.files)
  const images = Object.keys(req.files).map((key) => {
    const matches = key.match(/\[(\d+)\]/); // Extract index from key
    if (matches && matches[1]) {
      const index = parseInt(matches[1]); // Parse index as integer
      return { index, filename: req.files[key] }; // Return image object
    }
    return null;
  });
  images.map(image => {
    console.log(image.filename.originalFilename)
  })
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
}
  
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
    })

    const images = brand.images
    images.map((image) => {
      const imageName = image.value;
      const imagePath = path.join(__dirname, '../uploads', imageName);
  
      // Delete the image file from the file system
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error deleting image:', err);
          return res.status(500).json({ error: 'Failed to delete image' });
        }
      })
    })
   
    await brand.remove();
    return brand;
  };
  

module.exports = {
    createBrand,
    queryBrands,
    getBrandById,
    updateBrandById,
    deleteBrandById
}