const { getRecommendationID, getImages } = require('../services/recommend');
const { StatusCodes } = require('http-status-codes');

const getRecommendationId = async (req, res, next) => {
  try {
    const result = await getRecommendationID(req);

    res.status(StatusCodes.OK).json({
      message: 'recommendation by Session ID',
      data: { recommendationID: result },
    });
  } catch (err) {
    next(err);
  }
};

const getRecommendationImages = async (req, res, next) => {
  try {
    const result = await getImages(req);

    res.status(StatusCodes.OK).json({
      message: 'success to retrive all images',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getRecommendationId,
  getRecommendationImages,
};
