const { MongoClient, ObjectId } = require('mongodb');

const mongoose = require('mongoose')
const GridFSBucket = require("mongodb").GridFSBucket;
const conn = mongoose.createConnection(process.env.DB);

var bucket = null;
conn.once("open", function () {
  bucket = new GridFSBucket(conn, { bucketName: 'uploads' });
});

async function deleteImageFromGridFS(imageNamesToDelete) {
    for (const imageName of imageNamesToDelete) {
  try {
    const image = await bucket.find({ filename: imageName }).toArray();
    if (image.length > 0) {
        const imageIdToDelete = new ObjectId(image[0]._id);
        const imageObjectId = new ObjectId(imageIdToDelete);
        if(!bucket) return;
        // Delete the image from GridFS using the image ObjectId
        bucket.delete(imageObjectId, (error) => {
        if (error) {
            console.error('Error while deleting image from GridFS:', error.message);
        } else {
            console.log('Image deleted from GridFS successfully!');
        }
        });
}
  } catch (error) {
    console.error('Error while connecting to MongoDB:', error.message);
  }
}
}
module.exports = deleteImageFromGridFS;