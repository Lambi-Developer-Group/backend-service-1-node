const { getRecommendationID } = require('../services/recommend');
const { StatusCodes } = require('http-status-codes');

const getRecommendation = async (req, res, next) => {
  try {
    const result = await getRecommendationID(req);

    res
      .status(StatusCodes.OK)
      .json({
        message: 'recommendation by Session ID',
        data: { recommendationID: result },
      });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getRecommendation,
};
