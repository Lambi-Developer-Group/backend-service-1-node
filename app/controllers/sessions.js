const { newSession } = require('../services/sessions');
const { StatusCodes } = require('http-status-codes');

// added test
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

module.exports = {
  createNewSession,
};
