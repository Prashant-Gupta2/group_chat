const multer = require("multer");
const AWS = require("aws-sdk");

const upload = multer({
  storage: multer.memoryStorage()
});

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

const mediaShare = ()=>{
  app.post("/upload", upload.single("media"), async (req, res) => {

  try {

    const file = req.file;

    console.log(file)

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: `chat-media/${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    const data = await s3.upload(params).promise();

    res.json({
      mediaUrl: data.Location
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Upload failed"
    });
  }
});
}
module.exports ={mediaShare};