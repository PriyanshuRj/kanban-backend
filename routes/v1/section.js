const router = require('express').Router({mergeParams: true});
const sectioncontroller = require("../../controllers/sectioncontroller");
const passport = require("passport");

router.post("/", passport.authenticate("jwt", {session: false}), sectioncontroller.create);
router.put("/", passport.authenticate("jwt", {session: false}), sectioncontroller.update);
router.delete("/", passport.authenticate("jwt", {session: false}), sectioncontroller.deleteSection);

module.exports = router;