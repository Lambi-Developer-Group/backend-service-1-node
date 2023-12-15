const { newSession, getAll, getRecommendations, deleteSession } = require('../services/sessions');
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

const deleteAllSession = async (req, res, next) => {
  try {
    const result = await deleteSession(req);

    res
      .status(StatusCodes.OK)
      .json({ message: 'success delete sessions', email: result });
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

const getAllRecomendation = async (req, res, next) => {
  try {
    const result = await getRecommendations(req);

    console.log(result);

    res
      .status(StatusCodes.OK)
      .json({ message: 'success', reccomendationIDs: result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNewSession,
  getAllSession,
  getAllRecomendation,
  deleteAllSession,
};
