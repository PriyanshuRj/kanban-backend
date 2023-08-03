const express = require("express");
const usercontroller = require("../../controllers/usercontroller");
const imagecontroller = require("../../controllers/imagescontroller");
const router = express.Router();

router.post('/signup',usercontroller.signup);
router.post('/login',usercontroller.login);
router.post('/otpverify',usercontroller.otpverify);
router.post("/requestotp",usercontroller.requestotp);
router.post("/requestmobileotp",usercontroller.requestMobileOTP);
router.post('/mobile-otpverify',usercontroller.mobileotpverify);
router.post("/images",imagecontroller.getImages);
router.use("/profile", require('./profile'));
router.use("/project", require('./project'));
router.use('/section', require('./section'));
router.use('/task', require('./task'));
router.use("/invite", require('./invite'));
router.use("/comment", require("./comment"));
module.exports = router;
