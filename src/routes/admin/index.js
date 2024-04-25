const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const brandRoute = require('./brand.route');
const productRoute = require('./product.route');
const categoryRoute = require('./category.route');
const propertyRoute = require('./property.route');
const productVariantRoute = require('./product_variant.route');
const productMediaRoute = require('./product_media.route');
const customerRoute = require('./customer.route');
const homeRoute = require('./home.route');

const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/brands',
    route: brandRoute,
  },
  {
    path: '/products',
    route: productRoute,
  },
  {
    path: '/categories',
    route: categoryRoute
  },
  {
    path: '/properties',
    route: propertyRoute
  },
  {
    path: '/productVariants',
    route: productVariantRoute
  },
  {
    path: '/productMedia',
    route: productMediaRoute
  },
  {
    path: '/customers',
    route: customerRoute
  },
  {
    path: '/home',
    route: homeRoute
  }
];


defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});



module.exports = router;
