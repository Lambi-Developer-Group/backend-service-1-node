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

async function deleteSessions(email) {
  try {
    const querySnapshot = await firestore.collection('sessions').where('email', '==', email).get();

    const deletePromises = [];
    querySnapshot.forEach((doc) => {
      const deletePromise = firestore.collection('sessions').doc(doc.id).delete();
      deletePromises.push(deletePromise);
    });

    await Promise.all(deletePromises);

    console.log(`Deleted all sessions associated with email: ${email}`);
  } catch (error) {
    console.error('Error deleting sessions:', error);

    if (error.code === 'not-found') {
      throw new BadRequest('Sessions not found for the given email');
    }

    throw new BadRequest('Internal Server Error');
  }
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

const deleteSession = async (req) => {
  console.log('deleting session starts..');
  const { token, email } = req.body;

  if (!email) {
    try {
      const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
      const { email } = response.data;
  
      await deleteSessions(email)
      return email;
    } catch (error) {
      console.log(error);
      throw new BadRequest('Internal Server Error');
    }
  } else {
    try {  
      await deleteSessions(email)
      return email;
    } catch (error) {
      console.log(error);
      throw new BadRequest('Internal Server Error');
    }
  }
};

const broken = async (req) => {
  console.log('getting all sessions starts..');
  const { token } = req.body;

  if (!token) {
    console.log("Token is undefined");
    throw new BadRequest('Token is undefined');
  }
  
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
  console.log('Getting all recommendationIDs...');

  try {
    const { sessionID } = req.body;
    console.log("Request body session: ", sessionID);

    const sessionRef = firestore.collection('sessions').doc(sessionID);
    const sessionDoc = await sessionRef.get();

    if (!sessionDoc.exists) {
      throw new BadRequest('Session not found');
    } else {
      console.log('Session found based on sessionID. Returning recommendationIDs...');

      const sessionData = sessionDoc.data();
      const recommendationIDs = [];

      for (const key in sessionData) {
        if (Array.isArray(sessionData[key])) {
          recommendationIDs.push(key);
        }
      }

      return recommendationIDs;
    }
  } catch (error) {
    console.error(error);
    throw new BadRequest('Internal Server Error');
  }
};

const getAllSession = async (req) => {
  console.log('getting all sessions starts..');
  const { token } = req.body;

  if (!token) {
    console.log("Token is undefined");
    throw new BadRequest('Token is undefined');
  }
  
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

module.exports = {
  newSession,
  getRecommendations,
  deleteSession,
  getAllSession,
};
