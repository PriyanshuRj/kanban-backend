const express = require("express");
const passport = require("passport");
const upload = require("../../middleware/upload");
const profilecontroller = require("../../controllers/profilecontroller");
const router = express.Router();

router.put("/profilepicture", passport.authenticate("jwt", {session: false}), upload.single('file'),profilecontroller.updateProfilePicture);
router.put("/", passport.authenticate("jwt", {session: false}), upload.single('file'),profilecontroller.updateProfile);
router.get("/", passport.authenticate("jwt", {session: false}), profilecontroller.getProfile);
module.exports = router;