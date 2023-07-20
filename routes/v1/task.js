const router = require('express').Router({mergeParams: true});
const taskcontroller = require("../../controllers/taskcontroller");
const upload = require("../../middleware/upload");
const passport = require("passport");

router.post("/", passport.authenticate("jwt", {session: false}),upload.array('files'), taskcontroller.create);
router.post("/asigne", passport.authenticate("jwt", {session: false}), taskcontroller.asignUser);
router.put("/updatePositions", passport.authenticate("jwt", {session: false}), taskcontroller.updatePosition);
router.put("/", passport.authenticate("jwt", {session: false}),upload.array('files'), taskcontroller.update);
router.delete("/", passport.authenticate("jwt", {session: false}), taskcontroller.deleteTask);

module.exports = router;