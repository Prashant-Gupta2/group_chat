const express = require("express");

const router = express.Router();

const { mediaShare, upload} = require("../controllers/mediashare");
const authmiddleware = require('../middleware/authtenication');


router.post("/media-share", authmiddleware, upload.single("file"), mediaShare);

module.exports = router;