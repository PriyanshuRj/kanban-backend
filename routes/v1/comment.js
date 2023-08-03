const router = require('express').Router({mergeParams: true});
const commentController = require("../../controllers/commentController");
const passport = require("passport");

router.post("/", passport.authenticate("jwt", {session: false}), commentController.create);
router.get("/asigne", passport.authenticate("jwt", {session: false}), commentController.get);

module.exports = router;