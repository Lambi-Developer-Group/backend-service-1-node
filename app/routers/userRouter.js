const express = require('express');
const router = express();

const { getUsers, getSpesificUser } = require('../controllers/users');
const {
  deleteUserImages,
  getUserImages,
} = require('../controllers/userImages');

// users
router.get('/', getUsers);
router.get('/:id', getSpesificUser);

// user's images
router.get('/:id/images', getUserImages);
router.delete('/:id/images', deleteUserImages);

module.exports = router;
