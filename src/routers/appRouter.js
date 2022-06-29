//Import Libraries
const router = require("express").Router();
const { registerUser } = require("../middlewares/userForm");
const {
  loginPage,
  registerPage,
  homePage,
  forgetPassword,
  formRegister,
  formLogin,
  formForgetPassword,
} = require("../controllers/appControllers");

//Starting Project
//
//I just use router path here. Won't use controller function like (req, res)

//GET
router.get("/", homePage);
router.get("/home", homePage);
router.get("/login", loginPage);
router.get("/register", registerPage);
router.get("/forget-password", forgetPassword);
//POST
router.post("/register", registerUser, formRegister);
router.post("/login", formLogin);
router.post("/forget-password", formForgetPassword);

module.exports = router;
