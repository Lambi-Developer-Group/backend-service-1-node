const { StatusCodes } = require('http-status-codes');
const { getAll, getSpesific } = require('../services/users');

const getUsers = async (req, res, next) => {
  try {
    const result = await getAll();

    res
      .status(StatusCodes.OK)
      .json({ message: 'success retrive all users', data: result });
  } catch (error) {
    next(error);
  }
};

const getSpesificUser = async (req, res, next) => {
  try {
    const result = await getSpesific(req);

    // Assuming you want to send the data from the snapshot in the response
    res
      .status(StatusCodes.OK)
      .json({ message: 'success retrive the user', data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getSpesificUser,
};
