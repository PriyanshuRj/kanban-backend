const mongoose = require('mongoose')
const GridFSBucket = require("mongodb").GridFSBucket;
const conn = mongoose.createConnection(process.env.DB);;

var bucket;
conn.once("open", function () {
  bucket = new GridFSBucket(conn, { bucketName: 'uploads' });
});

const getImages = async (req, res) => {

  const { images } = req.body;
  try {
    let responseArray = [];
    let = image_message = "";
    async function downloadImages() {
      const downloadPromises = images.map(async imageName => {
        const downloadStream = bucket.openDownloadStreamByName(imageName);

        let filedata = "data:image/png;base64,";

        await downloadStream.on("data", function (data) {
          filedata += data.toString('base64');
        });


        // Return a promise to await completion of the download stream
        return new Promise((resolve, reject) => {
          downloadStream.on('end', () => {
            responseArray.push(filedata);
            resolve()
          }
          );
          downloadStream.on('error', reject);
        });
      });

      // Wait for all download promises to complete
      await Promise.all(downloadPromises);
    }
    await downloadImages();
    res.status(200).json({ numbarOfImages: responseArray.length, images: responseArray });
  }
  catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error in updating profile picture" });
  }
}
module.exports = {
  getImages
}