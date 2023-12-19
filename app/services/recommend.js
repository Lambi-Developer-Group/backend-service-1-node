const { Firestore } = require('@google-cloud/firestore');
const db = new Firestore();
const { BadRequest, NotFound } = require('../errors');
const randomName = require('./random-generator');
const axios = require('axios');

const getImageID = async (sessionId) => {
  const sessionRef = db.collection('sessions').doc(sessionId);
  const doc = await sessionRef.get();

  if (!doc.exists) {
    throw new NotFound('No Such Session');
  }

  return doc.data().imageID;
};

const getImagesByID = async (imageID) => {
  const imageRef = db.collection('images').doc(imageID);
  const doc = await imageRef.get();

  if (!doc.exists) {
    throw new NotFound('No Such Image ID');
  }

  return doc.data().images;
};

const storeToSessionDocument = async (images, sessionId) => {
  const sessionRef = db.collection('sessions').doc(sessionId);
  const recommendationID = await randomName();

  await sessionRef.update({ [recommendationID]: images });
  return recommendationID;
};

const getRecommendationID = async (req) => {
  const { sessionId } = req.body;

  const imageID = await getImageID(sessionId);

  const response = await axios.post(
    `https://lambi-model-zn6gm5cepa-et.a.run.app/api/recommendation`,
    { imageID }
  );

  const recommendationID = await storeToSessionDocument(
    response.data.data,
    sessionId
  );

  return recommendationID;
};

const getImages = async (req) => {
  const { sessionId, recommendationId } = req.body;

  const sessionRef = db.collection('sessions').doc(sessionId);
  const doc = await sessionRef.get();

  if (!doc.exists) {
    throw new NotFound('No Such Session');
  }

  if (!doc.data()[recommendationId]) {
    throw new NotFound('No Images with its recommendation ID');
  }

  return doc.data()[recommendationId];
};

module.exports = {
  getRecommendationID,
  getImages,
};
