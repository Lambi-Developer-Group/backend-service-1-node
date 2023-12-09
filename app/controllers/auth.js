const { register, login } = require('../services/auth');
const { StatusCodes } = require('http-status-codes');

const userRegister = async (req, res, next) => {
  try {
    const result = await register(req);

    res.status(StatusCodes.CREATED).json({
      message: 'add to Firestore Success',
      userId: result,
    });
  } catch (err) {
    next(err);
  }
};

const userLogin = async (req, res, next) => {
  try {
    const result = await login(req);

    res
      .status(StatusCodes.OK)
      .json({ message: 'success to login', user: result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  userRegister,
  userLogin,
};
