const { check, validationResult } = require('express-validator');

// User registration validation
exports.validateUserRegistration = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('phone', 'Phone number is required').not().isEmpty(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Restaurant registration validation
exports.validateRestaurantRegistration = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('phone', 'Phone number is required').not().isEmpty(),
  check('address', 'Address is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('category', 'Category is required').not().isEmpty(),
  check('deliveryFee', 'Delivery fee is required').isNumeric({ gt: 0 }),
  check('deliveryTime', 'Delivery time is required').isNumeric({ gt: 0 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Driver registration validation
exports.validateDriverRegistration = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('phone', 'Phone number is required').not().isEmpty(),
  check('vehicleType', 'Vehicle type is required').not().isEmpty(),
  check('vehicleColor', 'Vehicle color is required').not().isEmpty(),
  check('licenseNumber', 'License number is required').not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Product validation
exports.validateProduct = [
  check('name', 'Name is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('price', 'Price is required').isNumeric({ gt: 0 }),
  check('category', 'Category is required').not().isEmpty(),
  check('preparationTime', 'Preparation time is required').isNumeric({ gt: 0 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Order validation
exports.validateOrder = [
  check('items', 'Items are required').isArray({ min: 1 }),
  check('deliveryAddress', 'Delivery address is required').not().isEmpty(),
  check('estimatedDeliveryTime', 'Estimated delivery time is required').isNumeric({ gt: 0 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];