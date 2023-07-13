const express = require("express");
const passport = require("passport");
const inviteController = require("../../controllers/inviteController")
const router = express.Router();

router.post("/", passport.authenticate("jwt", {session: false}), inviteController.create);
router.get("/", passport.authenticate("jwt", {session: false}), inviteController.getInvite);
router.put("/", passport.authenticate("jwt", {session: false}), inviteController.replyInvite);
module.exports = router;