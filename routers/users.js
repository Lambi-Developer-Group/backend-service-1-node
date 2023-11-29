const express = require("express")
const router = express.Router()
const {Firestore} = require('@google-cloud/firestore');
const firestore = new Firestore();
const imageHandler = require("./images")
const bcrypt = require('bcryptjs');

// [async function way] push user creds to Firestore with autoGen ID
async function pushUser(firstName, lastName, age, password, email) {
    const timestamp = Date.now()
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
    console.log('Added document with ID: ', res.id)
    return res.id
}


// [async trycatch way] get user
router.get('/users', async (req, res) => {
    try {
        const ref = firestore.collection('users');
        const snapshot = await ref.get();

        if (snapshot.empty) {
            console.log('No matching documents.');
            return res.status(404).json({ error: 'No matching documents.' });
        }

        res.json(snapshot.docs.map(doc => doc.data()));
    } catch (error) {
        console.error('Error getting documents', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Hash Password with bcrypt
async function hashPassword(password) {
    const saltRounds = 10; // Adjust the saltRounds value as needed
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

// Add User Router
router
    .route('/user/addUser')
    .get((req, res) => {
        res.status(400).json({ status: "400" ,error: "Bad Request" })
    })
    .put((req, res) => {
        res.status(400).json({ status: "400" ,error: "Bad Request" })
    })
    .post(async (req, res) => {
        console.log('user add start')

        const { firstName, lastName, age, password, email } = req.body;

        // Check if required data is provided
        if (!firstName || !lastName || !age || !password || !email) {
          return res.status(400).json({ status: "400" ,error: "Bad Request, Please fill all the required Field"  })
        }

        const hashedPassword = await hashPassword(password)

        userID = await pushUser(firstName, lastName, age, hashedPassword, email)

        res.json({
            message:"add to Firestore Success",
            "Added document with userID": userID,
        }).status(200);
    })
    .delete((req, res) => {
        res.status(400).json({ status: "400" ,error: "Bad Request" })
    })

// Get User Router
router.get('/user/:id', async (req, res) => {
    const userID = req.params.id;
    try {
        const ref = firestore.collection('users').doc(userID);
        const snapshot = await ref.get();

        if (!snapshot.exists) {
            console.log('No matching document.');
            return res.status(404).json({ error: 'No matching document.' });
        }

        // Assuming you want to send the data from the snapshot in the response
        res.json(snapshot.data());
    } catch (error) {
        console.error('Error getting document', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// get all images in bucket from firestore
router.get('/images', async (req, res) => {
    try {
        const ref = firestore.collection('images');
        const snapshot = await ref.get();

        // Extract the fileNames from the snapshot
        const fileNames = [];
        snapshot.forEach((doc) => {
            const filename = doc.data().fileName;
            fileNames.push(filename);
        });

        // Assuming you want to send the data from the snapshot in the response
        res.json(fileNames);
    } catch (error) {
        console.error('Error getting document', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// get all images associated with this user from firestore
router.get('/images/:id', async (req, res) => {
    const userID = req.params.id;
    try {
        const ref = firestore.collection('images');
        const snapshot = await ref.where('userID', '==', userID).get();

        // Extract the fileNames from the snapshot
        const fileNames = [];
        snapshot.forEach((doc) => {
            const filename = doc.data().fileName;
            fileNames.push(filename);
        });

        // Assuming you want to send the data from the snapshot in the response
        res.json(fileNames);
    } catch (error) {
        console.error('Error getting document', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Login User Router
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log("login started",email);

    try {
        const userRef = firestore.collection('users').where('email', '==', email);
        const userSnapshot = await userRef.get();

        if (userSnapshot.empty) {
            console.log("field empty!");
            return res.status(401).json({ error: 'Wrong email or password' });
        }

        const userData = userSnapshot.docs[0].data();
        const isPasswordValid = await bcrypt.compare(password.toString(), userData.password.toString());

        if (isPasswordValid) {
            console.log("login accepted");
            res.json({ success: true, user: userData });
        } else {
            console.log("login rejected");
            res.status(401).json({ error: 'Wrong email or password' });
        }
    } catch (error) {
        console.error('Error during login', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// deletes all images associated with this user from firestore
router.delete('/user/images/:id', async (req, res) => {
    const userID = req.params.id;
    try {
        const ref = firestore.collection('images');
        const snapshot = await ref.where('userID', '==', userID).get();

        // Extract the fileNames from the snapshot
        const fileNames = [];
        snapshot.forEach((doc) => {
            const filename = doc.data().fileName;
            fileNames.push(filename);

            // Delete the document from Firestore
            const docRef = ref.doc(doc.id);
            docRef.delete();
        });

        // delete object based on fileNames
        await imageHandler.deleteFiles(fileNames)

        res.json({
            message: "Successfully deleted files",
            fileNames: fileNames
          });
    } catch (error) {
        console.error('Error getting document', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/users/firestore', (req, res) => {
    quickstart()
    res.json({message:"Firestore executed"})
})

module.exports = router