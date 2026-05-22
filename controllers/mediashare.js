const multer = require("multer");
const AWS = require("aws-sdk");
const path = require("path");

// AWS CONFIG
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

const upload = multer({

  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB
  },

 fileFilter: (req, file, cb) => {

  console.log(file.mimetype);

  if (

    file.mimetype.startsWith("image/") ||

    file.mimetype.startsWith("video/") ||

    file.mimetype.startsWith("audio/") ||

    file.mimetype === "application/pdf"
  ) {

    cb(null, true);

  } else {

    cb(new Error("Invalid file type"));
  }
}
});

const mediaShare = async (req, res) => {

  try {

    const file = req.file;

    if (!file) {

      return res.status(400).json({
        message: "No file uploaded"
      });
    }

    // SAFE FILE NAME
    const fileExtension = path.extname(file.originalname);

    const fileName = `chat-media/${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}${fileExtension}`;

    // S3 PARAMS
    const params = {

      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    // UPLOAD
    const data = await s3.upload(params).promise();

    return res.status(200).json({

      message: "Upload successful",

      mediaUrl: data.Location
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({

      message: "Upload failed"
    });
  }
};

module.exports = { mediaShare, upload};