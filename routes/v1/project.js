const express = require("express");
const passport = require("passport");
const projectcontroller = require("../../controllers/projectcontroller");
const router = express.Router();

router.post("/", passport.authenticate("jwt", {session: false}), projectcontroller.createProject);
router.get("/", passport.authenticate("jwt", {session: false}), projectcontroller.getAllProjects);
router.get("/getProject",passport.authenticate("jwt", {session: false}), projectcontroller.getSingleProjectData);
module.exports = router;