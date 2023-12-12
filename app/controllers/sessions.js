const { newSession, getAll } = require('../services/sessions');
const { StatusCodes } = require('http-status-codes');

const createNewSession = async (req, res, next) => {
  try {
    const result = await newSession(req);

    console.log(result);

    res
      .status(StatusCodes.OK)
      .json({ message: 'success created new session', sessionID: result });
  } catch (error) {
    next(error);
  }
};

const getAllSession = async (req, res, next) => {
  try {
    const result = await getAll(req);

    console.log(result);

    res
      .status(StatusCodes.OK)
      .json({ message: 'success', sessionID: result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNewSession,
  getAllSession,
};
