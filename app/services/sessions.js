const { Firestore } = require('@google-cloud/firestore');
const {OAuth2Client} = require('google-auth-library');
const firestore = new Firestore();
const bcrypt = require('bcryptjs');
const { BadRequest } = require('../errors');
const axios = require('axios');

async function pushSession(email) {
  const timestamp = Date.now();
  const date = new Date(timestamp);
  const formattedDate = date.toISOString();
  const res = await firestore.collection('sessions').add({
    email: email,
    createdAt: formattedDate,
  });
  console.log('Added session with Firestore ID: ', res.id);
  return res.id;
}

const newSession = async (req) => {
  console.log('creating new session starts..');
  const { token } = req.body;
  
  try {
    const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
    const { email } = response.data;
    sessionID = await pushSession(email)
    return sessionID;
  } catch (error) {
    console.log(error);
    throw new BadRequest('Internal Server Error');
  }
  return sessionID;
};

const getAll = async (req) => {
  console.log('getting all sessions starts..');
  const { token } = req.body;
  
  try {
    const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
    const { email } = response.data;

    const sessionRef = firestore.collection('sessions').where('email', '==', email);
    const sessionSnapshot = await sessionRef.get();
  
    if (sessionSnapshot.empty) {
      throw new BadRequest('Email not found in sessions');
    } else {
      console.log('Sessions found based on Email. Returning sessionIDs...');
      
      const sessionIDs = sessionSnapshot.docs.map(doc => doc.id);
      
      return sessionIDs;
    }
  } catch (error) {
    console.error(error);
    throw new BadRequest('Internal Server Error');
  }
};

const getRecommendations = async (req) => {
  console.log('getting all recommendationID(s) starts..');
  const { sessionID } = req.body;

  try {
    const sessionRef = firestore.collection('sessions').doc(sessionID);
    const sessionDoc = await sessionRef.get();

    if (!sessionDoc.exists) {
      throw new BadRequest('Session not found');
    } else {
      console.log('Session found based on sessionID. Returning session data...');

      const sessionData = sessionDoc.data();

      const linkArrays = Object.entries(sessionData)
        .filter(([key, value]) => Array.isArray(value) && value.every(link => link.includes('storage.cloud.google.com')))
        .map(([key]) => key);

      return linkArrays;
    }
  } catch (error) {
    console.error(error);
    throw new BadRequest('Internal Server Error');
  }
};

module.exports = {
  newSession,
  getAll,
  getRecommendations,
};
