const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();
const bcrypt = require('bcryptjs');

// [async function way] push user creds to Firestore with autoGen ID
async function pushUser(firstName, lastName, age, password, email) {
  const timestamp = Date.now();
  const date = new Date(timestamp);
  const formattedDate = date.toISOString();
  const res = await firestore.collection('users').add({
    firstName: firstName,
    lastName: lastName,
    age: age,
    password: password,
    createdAt: formattedDate,
    email: email,
  });
  console.log('Added document with ID: ', res.id);
  return res.id;
}

// Hash Password with bcrypt
async function hashPassword(password) {
  const saltRounds = 10; // Adjust the saltRounds value as needed
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

const userRegister = async (req, res, next) => {
  try {
    console.log('user add start');

    const { firstName, lastName, age, password, email } = req.body;

    // Check if required data is provided
    if (!firstName || !lastName || !age || !password || !email) {
      return res.status(400).json({
        status: '400',
        error: 'Bad Request, Please fill all the required Field',
      });
    }

    const hashedPassword = await hashPassword(password);

    userID = await pushUser(firstName, lastName, age, hashedPassword, email);

    res
      .json({
        message: 'add to Firestore Success',
        'Added document with userID': userID,
      })
      .status(200);
  } catch (err) {
    // console.error('Error during register', err);
    res.status(500).json({ error: 'Internal Server Error' });
    next(err);
  }
};

const userLogin = async (req, res, next) => {
  const { email, password } = req.body;
  console.log('login started', email);

  try {
    const userRef = firestore.collection('users').where('email', '==', email);
    const userSnapshot = await userRef.get();

    if (userSnapshot.empty) {
      console.log('field empty!');
      return res.status(401).json({ error: 'Wrong email or password' });
    }

    const userData = userSnapshot.docs[0].data();
    const isPasswordValid = await bcrypt.compare(
      password.toString(),
      userData.password.toString()
    );

    if (isPasswordValid) {
      console.log('login accepted');
      res.json({ success: true, user: userData });
    } else {
      console.log('login rejected');
      res.status(401).json({ error: 'Wrong email or password' });
    }
  } catch (error) {
    // console.error('Error during login', error);
    res.status(500).json({ error: 'Internal Server Error' });
    next(error);
  }
};

module.exports = {
  userRegister,
  userLogin,
};
