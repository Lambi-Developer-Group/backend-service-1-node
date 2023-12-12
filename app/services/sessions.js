const { Firestore } = require('@google-cloud/firestore');
const {OAuth2Client} = require('google-auth-library');
const firestore = new Firestore();
const bcrypt = require('bcryptjs');
const { BadRequest } = require('../errors');
const axios = require('axios');

// [async function way] push user creds to Firestore with autoGen ID
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

    const userRef = firestore.collection('sessions').where('email', '==', email);
    const userSnapshot = await userRef.get();
  
    if (userSnapshot.empty) {
      throw new BadRequest('Email not found in sessions');
    } else {
      console.log('Sessions found based on Email. Returning sessionIDs...');
      
      // Extracting sessionIDs from the snapshot
      const sessionIDs = userSnapshot.docs.map(doc => doc.id);
      
      return sessionIDs;
    }
  } catch (error) {
    console.error(error);
    throw new BadRequest('Internal Server Error');
  }
};

//added test
const test = async (req) => {
  console.log('Response: test');
  return "Test Successful"
};

const login = async (req) => {
  const { token } = req.body;
  console.log('login started');

  if (!token) {
    throw new BadRequest('Bad Request, Please fill all the required Field');
  }

  try {
    // Make a request to the Google API with the provided token
    const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
    const { email, name, locale} = response.data;

    const userRef = firestore.collection('users').where('email', '==', email);
    const userSnapshot = await userRef.get();
  
    if (userSnapshot.empty) {
      console.log('Email not found on Firestore. Creating new User in Firestore...');
      await pushUser(name, locale, email);
    }else{
      console.log('Email found on Firestore. Login in...');
      return email;
    }
    return email;
  } catch (error) {
    console.log(error);
    throw new BadRequest('Internal Server Error');
  }
  return ;
};

const loginDump = async (req) => {
  const { email, password } = req.body;
  console.log('login started', email);

  const userRef = firestore.collection('users').where('email', '==', email);
  const userSnapshot = await userRef.get();

  if (userSnapshot.empty) {
    console.log('field empty!');
    throw new BadRequest('Wrong email or password');
  }

  const userData = userSnapshot.docs[0].data();
  const isPasswordValid = await bcrypt.compare(
    password.toString(),
    userData.password.toString()
  );

  if (isPasswordValid) {
    console.log('login accepted');
    return userData;
  } else {
    console.log('login rejected');
    throw new BadRequest('Wrong email or password');
  }
};

module.exports = {
  newSession,
  getAll,
};
