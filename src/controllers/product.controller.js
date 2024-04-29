const httpStatus = require('http-status');
const path = require('path');
const fs = require('fs');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { productService, propertyService, productVariantService, productMediaService } = require('../services');
const { Brand, Property, ProductMedia, ProductVariant } = require('../models');
const generateSlug = require('../services/generateSlug');
const { find } = require('../config/logger');
const formidable = require('formidable');
const { uploadSingleFile, uploadMultipleMediaFiles } = require('../services/fileUpload.service');
const { createProductMedia } = require('./product_media.controller');
const product_variantModel = require('../models/product_variant.model');

const property_ids = [];
// const createProperty = async (variants) => {
//   variants?.map(async (variant) => {
//     if (variant.name === 'Custom') {
//       const doc = await Property.findOne({ name: variant.customName });
//       if (doc) {
//         console.log('Found documents:', doc);
//       } else {
//         const slug = generateSlug(variant.customName);
//         const property = new Property({
//           name: variant.customName,
//           // unit: req.body.unit,
//           options: variant.options,
//           slug: slug,
//         });
//         const newProperty = await property.save();
//         return newProperty;
//         // console.log(newProperty)
//       }
//     }
//   });
// };

const createProperty = async (variants) => {
  const createdProperties = [];
  await Promise.all(variants.map(async (variant) => {
    if (variant.name === 'Custom') {
      const doc = await Property.findOne({ name: variant.customName });
      if (doc) {
        console.log('Found document:', doc);
        createdProperties.push(doc);
      } else {
        const slug = generateSlug(variant.customName);
        const property = new Property({
          name: variant.customName,
          // unit: req.body.unit,
          options: variant.options,
          slug: slug,
        });
        const newProperty = await property.save();
        console.log('Created new property:', newProperty);
        createdProperties.push(newProperty);
      }
    }
  }));
  return createdProperties;
};


const findProperties = async (variants) => {
  // console.log(variants)
  if (variants) {
    for (const prop of variants) {
      let result;
      let propertyId;
      // console.log(prop)

      // Check if variant name is 'Custom'
      if (prop.name === 'Custom') {
        result = await Property.findOne({ name: prop.customName }).exec();
      } else {
        result = await Property.findOne({ name: prop.name }).exec();
      }
      // console.log(result)
      if (result) {
        propertyId = result._id;
        //  console.log('property ID: ' + propertyId)
        // Check if propertyId already exists in property_ids array
        if (!property_ids.includes(propertyId)) {
          // console.log('inside')
          property_ids.push(propertyId);
        }
      }
    }
    
    return property_ids;
  }
};

const getImageById = async (imageIdToFind) => {
  try {
    const image = await ProductMedia.findById(imageIdToFind);
    if (!image) {
      // console.log('Brand not found');
      return null;
    }
    return image;
  } catch (err) {
    console.log(err);
  }
};

const createProduct = catchAsync(async (req, res) => {
  try {
    // Save newly created custom property
    if(req.body.variants) {
      const property = await createProperty(req.body.variants);   
   
    }

    
    // const newProperty = new Property();
    // console.log(req.body.variants);
    // req.body.variants?.map(async (variant) => {});

    // create new product
    const product = await productService.createProduct(req.body);

    // console.log('product: ' + product);

    // save product variant
    if (product) {
      // let property_ids = [];
      let savedVariants = [];

      await findProperties(req.body.variants);
      
    //  console.log(property_ids)

      const createVariantPromises = req.body.productVariant?.map(async (variant) => {
        newVariant = await productVariantService.createProductVariant(variant, product, property_ids);
        savedVariants.push(newVariant);
        return newVariant;
        // console.log(variant);
        // console.log(req.body.variants);
      });
      Promise.all(createVariantPromises)
        .then(() => {
          console.log('productVariants:' + savedVariants);
          if (savedVariants.length > 0) {
            // const id_count = variant_ids.count();

            savedVariants?.map((variant, index) => {
              // Check if the productVariant[0][image] field is empty
              if (req.files && req.files[`productVariant[${index}][image]`]) {
                const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
                const imageFile = req.files[`productVariant[${index}][image]`];
                const fileSize = imageFile.size;
                const variantImage = uploadSingleFile(imageFile);
                const fileExtension = variantImage.split('.').pop();
                // console.log(fileExtension);
                // console.log(variant.name);
                let file_type = '';
                if (imageExtensions.includes(fileExtension.toLowerCase())) {
                  file_type = 'image';
                } else {
                  file_type = 'video';
                }

                const mediaBody = {
                  disk_name: 'uploads',
                  file_name: variantImage,
                  product_id: product._id,
                  variant_id: variant.id,
                  title: variant.name, //how to save title
                  filesize: fileSize,
                  type: file_type,
                };

                const media = productMediaService.createProductMedia(mediaBody);
                // media.save();
                // console.log(media);
                // Process the image file
              } else {
                // The field is empty
                // Handle empty image field

                return res.status(400).json({ error: 'Image file is required' });
              }
            });
          }
        })
        .catch((error) => {
          console.error('Error creating product variants:', error);
        });

      const files = req.files['files[]'];

      if (files) {
        // Check if files is an array
        if (Array.isArray(files)) {
          // Multiple files uploaded
          files.forEach((file) => {
            console.log('Array File:', file.originalFilename);
            const fileName = Date.now() + file.originalFilename;
            const file_path = path.join(__dirname, '../uploads', fileName);
            fs.renameSync(file.filepath, file_path); // Move file to desired location

            const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];

            const fileSize = file.size;

            const fileExtension = fileName.split('.').pop();
            // console.log(fileExtension);
            // console.log(variant.name);
            let file_type = '';
            if (imageExtensions.includes(fileExtension.toLowerCase())) {
              file_type = 'image';
            } else {
              file_type = 'video';
            }
            const mediaBody = {
              disk_name: 'uploads',
              file_name: fileName,
              product_id: product._id,
              variant_id: null,
              title: 'Media', //how to save title
              filesize: fileSize,
              type: file_type,
            };
            const media = productMediaService.createProductMedia(mediaBody);
            // console.log(media);
            // media.save();

            // uploadedFiles.push(fileName);
          });
        } else {
          // Single file uploaded
          console.log('File:', files.originalFilename);
          const fileName = Date.now() + files.originalFilename;
          const file_path = path.join(__dirname, '../uploads', fileName);
          fs.renameSync(files.filepath, file_path); // Move file to desired location

          const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];

          const fileSize = files.size;

          const fileExtension = fileName.split('.').pop();
          // console.log(fileExtension);
          // console.log(variant.name);
          let file_type = '';
          if (imageExtensions.includes(fileExtension.toLowerCase())) {
            file_type = 'image';
          } else {
            file_type = 'video';
          }
          const mediaBody = {
            disk_name: 'uploads',
            file_name: fileName,
            product_id: product._id,
            variant_id: null,
            title: 'Media', //how to save title
            filesize: fileSize,
            type: file_type,
          };

          const media = productMediaService.createProductMedia(mediaBody);
          // console.log(media);
          // media.save();
        }
      } 
    }
     return res.status(201).json({ message: 'Product created successfully!' });
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
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  const brand = await Brand.findById(product.brand_id);

  const productVariant = await ProductVariant.find({ product_id: product._id }).exec();
  console.log(productVariant)

  const productMedia = await ProductMedia.find({ product_id: product._id }).exec();

  const properties = await Property.find().exec();
  //  console.log(properties)
  //  console.log(productVariant)
  let variantProperties = [];
  if (productVariant && properties) {
    variantProperties = productVariant
      .map((prop) => {
        // console.log('Property ID:', prop._id);
        return properties.filter((item) => prop.property_id.includes(item._id));
      })
      .flat();
  }

  console.log('Variant Properties:', variantProperties);

  res.send({
    product: product,
    brand: brand,
    productVariant: productVariant,
    productMedia: productMedia,
    variantProperties: variantProperties,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  try {
     console.log(req.body);
    // console.log(req.files);

    // if new custom property add to property table
    createProperty(req.body.variants);

    // update product table
    const product = await productService.updateProductById(req.params.productId, req.body);
    if (product) {
      // let property_ids = [];
      let savedVariants = [];

      await findProperties(req.body.variants);
      // console.log('property ids:' + property_ids)

      if (req.body.productVariant1 && req.body.productVariant1.length > 0) {
        console.log('inside');
        //1 step.  if new vairant is created. delete all old product variant and their associated images
        if (req.body.productVariant) {
          const products = await ProductVariant.find({ product_id: product._id }).exec();

          if (products) {
            // delete product variant images
            products?.map(async (item) => {
              // console.log(product._id);

              const res = await ProductMedia.findOne({ variant_id: item._id }).exec();
              // console.log(res)
              if (res) {
                // pending if no image
                const filename = res?.file_name;
                const imagePath = path.join(__dirname, '../uploads', filename);

                // Delete the image file from the file system
                fs.unlink(imagePath, (err) => {
                  if (err) {
                    console.error('Error deleting image:', err);
                    return res.status(500).json({ error: 'Failed to delete image' });
                  }
                });
                const delete_res = await ProductMedia.deleteOne({ variant_id: item._id });
              }
            });
          }

          // delete all product variant belonging to this product
          const variant_delete = await ProductVariant.deleteMany({ product_id: product._id }).exec();
          // console.log(variant_delete);
        }

        // Now, createVariantPromises array contains promises for uploaded images

        const images = [];
        property_ids.flat();
        // console.log(req.files)
        const createVariantPromises = req.body.productVariant1?.map(async (variant, index) => {
          newVariant = await productVariantService.createProductVariant(variant, product, property_ids);
          console.log(newVariant);
          if (req.files) {
            req.files['newVariantImages[]'].forEach(async (fileItem) => {
              if (variant.imageName === fileItem.originalFilename) {
                images.push(fileItem.originalFilename);
                const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
                const imageFile = fileItem;
                const fileSize = imageFile.size;
                const variantImage = uploadSingleFile(imageFile);
                const fileExtension = variantImage.split('.').pop();
                console.log(fileExtension);
                // console.log(savedVariant.name);
                let file_type = '';
                if (imageExtensions.includes(fileExtension.toLowerCase())) {
                  file_type = 'image';
                } else {
                  file_type = 'video';
                }
                const mediaBody = {
                  disk_name: 'uploads',
                  file_name: variantImage,
                  product_id: product._id,
                  variant_id: newVariant.id,
                  title: newVariant.name, //how to save title
                  filesize: fileSize,
                  type: file_type,
                };
                const media = await productMediaService.createProductMedia(mediaBody);

                // console.log(media);
              }
            });
          }
        });
      }

      // handle case where old product variant image is updated
      // console.log(req.files)
      // console.log(req.body)

      if (req.files && req.files[`oldVariantImages[]`]) {
        if (req.body.oldImageIndex && req.body.oldImageIndex.length > 0) {
          req.body.oldImageIndex?.map(async (item, index) => {
            console.log(req.files);
            if (Array.isArray(req.files['oldVariantImages[]'])) {
              req.files['oldVariantImages[]'].forEach(async (fileItem) => {
                if (item.name === fileItem.originalFilename) {
                  const product = await ProductVariant.findOne({ name: item.variantName }).exec();
                  if (product) {
                    const res = await ProductMedia.findOne({ variant_id: product._id }).exec();
                    console.log('res:' + res);
                    if (res) {
                      const filename = res.file_name;
                      const imagePath = path.join(__dirname, '../uploads', filename);

                      // Delete the image file from the file system
                      if (imagePath) {
                        fs.unlink(imagePath, (err) => {
                          if (err) {
                            console.error('Error deleting image:', err);
                            return res.status(500).json({ error: 'Failed to delete image' });
                          }
                        });
                      }

                      // upload image

                      const variantImage = uploadSingleFile(fileItem);
                      console.log(variantImage);
                      res.file_name = variantImage;
                      await res.save();
                      // return res.status(201).json({ message: 'Product updated successfully!' });
                    }
                  }
                }
              });
            }  else {
              //  manage single upload
              const fileItem =req.files['oldVariantImages[]']

              if (item.name === fileItem.originalFilename) {
                const product = await ProductVariant.findOne({ name: item.variantName }).exec();
                if (product) {
                  const res = await ProductMedia.findOne({ variant_id: product._id }).exec();
                  console.log('res:' + res);
                  if (res) {
                    const filename = res.file_name;
                    const imagePath = path.join(__dirname, '../uploads', filename);

                    // Delete the image file from the file system
                    if (imagePath) {
                      fs.unlink(imagePath, (err) => {
                        if (err) {
                          console.error('Error deleting image:', err);
                          return res.status(500).json({ error: 'Failed to delete image' });
                        }
                      });
                    }

                    // upload image

                    const variantImage = uploadSingleFile(fileItem);
                    console.log(variantImage);
                    res.file_name = variantImage;
                    await res.save();
                    // return res.status(201).json({ message: 'Product updated successfully!' });
                  }
                }
              }
            }
          });
        }
      }

      // Media Section

      // check for deleted images

      if (req.body.deletedImages?.length > 0) {
        try {
          // console.log(req.body.deletedImages);
          req.body.deletedImages?.map(async (imageId) => {
            const image = await getImageById(imageId);

            if (image) {
              const imageName = image.file_name;
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
              const updateMedia = await ProductMedia.findByIdAndRemove(imageId);
            }

            // console.log(updateMedia)
            // const updatedBrand = await removeImageById(brandId, imageId);
            // console.log(updatedBrand);
          });
        } catch (err) {
          throw err;
        }
      }

      // add files to media

      const files = req.files['files[]'];
      // console.log(files)

      if (files) {
        // Check if files is an array
        if (Array.isArray(files)) {
          // Multiple files uploaded
          files.forEach((file) => {
            console.log('Array File:', file.originalFilename);
            const fileName = Date.now() + file.originalFilename;
            const file_path = path.join(__dirname, '../uploads', fileName);
            fs.renameSync(file.filepath, file_path); // Move file to desired location

            const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];

            const fileSize = file.size;

            const fileExtension = fileName.split('.').pop();
            // console.log(fileExtension);
            // console.log(variant.name);
            let file_type = '';
            if (imageExtensions.includes(fileExtension.toLowerCase())) {
              file_type = 'image';
            } else {
              file_type = 'video';
            }
            const mediaBody = {
              disk_name: 'uploads',
              file_name: fileName,
              product_id: product._id,
              variant_id: null,
              title: 'Media', //how to save title
              filesize: fileSize,
              type: file_type,
            };
            const media = productMediaService.createProductMedia(mediaBody);
            console.log('success');
            // return res.status(201).json({ message: 'Product updated successfully!' });
            // media.save();

            // uploadedFiles.push(fileName);
          });
        } else {
          // Single file uploaded
          console.log('File:', files.originalFilename);
          const fileName = Date.now() + files.originalFilename;
          const file_path = path.join(__dirname, '../uploads', fileName);
          fs.renameSync(files.filepath, file_path); // Move file to desired location

          const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];

          const fileSize = files.size;

          const fileExtension = fileName.split('.').pop();
          // console.log(fileExtension);
          // console.log(variant.name);
          let file_type = '';
          if (imageExtensions.includes(fileExtension.toLowerCase())) {
            file_type = 'image';
          } else {
            file_type = 'video';
          }
          const mediaBody = {
            disk_name: 'uploads',
            file_name: fileName,
            product_id: product._id,
            variant_id: null,
            title: 'Media', //how to save title
            filesize: fileSize,
            type: file_type,
          };

          const media = productMediaService.createProductMedia(mediaBody);
          console.log('success');
          
          // console.log(media);
          // media.save();
        }
      } 
      return res.status(201).json({ message: 'Product updated successfully!' });
    }
  } catch (err) {
    console.log(err);
  }
  // res.send(product);
});

const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProductById(req.params.productId);
  res.status(httpStatus.NO_CONTENT).json({ message: 'Product deleted successfully!' });
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
