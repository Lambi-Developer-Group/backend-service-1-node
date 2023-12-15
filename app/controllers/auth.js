const { register, login, submitToken } = require('../services/auth'); //added test
const { StatusCodes } = require('http-status-codes');

const test = async (req, res, next) => {
  try {
    res.status(StatusCodes.OK).json({
      message: 'auth route',
    });
  } catch (err) {
    next(err);
  }
};

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

// added test
const testAuth = async (req, res, next) => {
  try {
    const result = await test();

    console.log(result);

    res.status(StatusCodes.OK).json({ result });
  } catch (error) {
    next(error);
  }
};

const tokenSubmitter = async (req, res, next) => {
  try {
    const result = await submitToken(req);

    console.log(result);

    res
      .status(StatusCodes.OK)
      .json({ message: 'success add token', documentID: result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  userRegister,
  userLogin,
  // added test
  testAuth,
  tokenSubmitter,
  test,
};
