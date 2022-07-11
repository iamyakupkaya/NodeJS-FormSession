//Import Libraries
const router = require("express").Router();
const {
  showAdminPanel,
  showProfilePanel,
} = require("../controllers/manageControllers");
const { sessionRight } = require("../middlewares/manageMidware");

//Starting Project
//
//I just use router path here. Won't use controller function like (req, res)

//GET
router.get("/", sessionRight, showAdminPanel);
router.get("/profile", sessionRight, showProfilePanel);

module.exports = router;
