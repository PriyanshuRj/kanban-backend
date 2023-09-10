const ConversationController = require("../../controllers/chatController");
const router = require('express').Router({mergeParams: true});
const passport = require("passport");

router.get("/", passport.authenticate("jwt", {session: false}), ConversationController.findAllConversations);
router.get("/ourChats", passport.authenticate("jwt", {session: false}), ConversationController.findConversations);


module.exports = router;