//Import Libraries
const router = require("express").Router();
const deneme = require("../middlewares/userForm");
const {
  loginPage,
  registerPage,
  homePage,
  forgetPassword,
  formRegister,
  formLogin,
  formForgetPassword,
  logoutPage,
  verifyEmail,
  newPasswordForm,
  saveNewPassword,
} = require("../controllers/appControllers");

//Starting Project
//
//I just use router path here. Won't use controller function like (req, res)

//GET
//home gets
router.get("/", homePage);
router.get("/home", homePage);
//gets login page
router.get("/login", loginPage);
//gets register page
router.get("/register", registerPage);
//gets forget-password page
router.get("/forget-password", forgetPassword);
//gets logout page
router.get("/logout", logoutPage);
//gets email verify page
router.get("/verify", verifyEmail);
//gets new password page
router.get("/newpassword/:id/:token", newPasswordForm);
router.get("/newpassword", newPasswordForm);

//POST
router.post("/register", deneme.registerUser(), formRegister);
router.post("/login", deneme.loginUser(), formLogin);
router.post("/forget-password", deneme.forgetEmail(), formForgetPassword);
router.post("/newpassword", deneme.newPasswordValidator(), saveNewPassword);

module.exports = router;
