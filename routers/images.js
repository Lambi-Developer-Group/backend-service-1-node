const express = require("express");
const router = express.Router();
const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();
const util = require("util");
const Multer = require("multer");
const maxSize = 2 * 1080 * 1920;
const bucket = storage.bucket("cc-fashap-private");

// Multer middleware configuration
let processFile = Multer({
    storage: Multer.memoryStorage(),
    limits: { fileSize: maxSize },
}).single("file");

let processFileMiddleware = util.promisify(processFile);

// push file info to Firestore with autoGen ID
async function pushFileInfo(userID, fileName) {
    const res = await firestore.collection('images').add({
        userID: userID,
        fileName: fileName,
    });
    console.log('Added document with doc ID: ', res.id);
    return res.id;
}

// function to add image to Cloud Storage and store its info on Firestore
router.route('/image/addImage')
    .get((req, res) => {
        res.status(400).json({
            status: "400",
            error: "Bad Request"
        });
    })
    .put((req, res) => {
        res.status(400).json({
            status: "400",
            error: "Bad Request"
        });
    })
    .post(async (req, res) => {
        console.log('uploading start');

        try {
            await processFileMiddleware(req, res);

            if (!req.file) {
                return res.status(400).send({
                    message: "Please upload a file!"
                });
            }

            // Create a new blob in the bucket and upload the file data.
            const blob = bucket.file(req.file.originalname);
            const blobStream = blob.createWriteStream({
                resumable: false,
            });

            blobStream.on("error", (err) => {
                res.status(500).send({
                    message: err.message
                });
            });

            blobStream.on("finish", async (data) => {
                // Create URL for direct file access via HTTP.
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;


                const { userID } = req.body;

                if (!userID) {
                    return res.status(400).json({
                        status: "400",
                        error: "Bad Request",
                        message: "Saving to Firestore Failed!"
                    });
                }

                // Move the pushFileInfo call inside the finish event
                pushFileInfo(userID, req.file.originalname);

                // Now send the response after processing is complete
                res.status(200).send({
                    message: "Uploaded the file successfully: " + req.file.originalname,
                    url: publicUrl,
                });
            });

            blobStream.end(req.file.buffer);
        } catch (err) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(500).send({
                    message: "File size cannot be larger than 2MB!",
                });
            }

            res.status(500).send({
                message: `Could not upload the file: ${req.file.originalname}. ${err}`,
            });
        }
    })
    .delete((req, res) => {
        res.status(400).json({
            status: "400",
            error: "Bad Request"
        });
    });

// Export the router
module.exports = router;
