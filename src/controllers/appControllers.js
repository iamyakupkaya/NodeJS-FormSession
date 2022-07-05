const { validationResult } = require("express-validator");

const homePage = (req, res, next) => {
  if (req.session.sayac) {
    req.session.sayac++;
  } else {
    req.session.sayac = 1;
  }

  try {
    // burası layout ilk çalışacak ejs sonrasında ise ilk parametre layout içerisinde çağırılacak demektir.
    res.render("home", {
      layout: "./layout/auth_layout.ejs", // layout özel kalasördür
      sayac: req.session.sayac,
    });
  } catch (error) {
    console.log("We have an error", error);
    res.send({ ERROR: "WARN.! You got an error" + error.message });
  }
};

const loginPage = (req, res, next) => {
  try {
    // burası layout ilk çalışacak ejs sonrasında ise ilk parametre layout içerisinde çağırılacak demektir.
    res.render("login", { layout: "./layout/auth_layout.ejs" });
  } catch (error) {
    console.log("We have an error", error);
    res.send({ ERROR: "WARN.! You got an error" + error.message });
  }
};

const registerPage = (req, res, next) => {
  console.log("GET REGİSTER İÇİ");

  try {
    // console.log(req.flash("validation_errors"));
    // burası layout ilk çalışacak ejs sonrasında ise ilk parametre layout içerisinde çağırılacak demektir.
    res.render("register", { layout: "./layout/auth_layout.ejs" });
  } catch (error) {
    console.log("We have an error", error);
    res.send({ ERROR: "WARN.! You got an error" + error.message });
  }
};

const forgetPassword = (req, res, next) => {
  try {
    // burası layout ilk çalışacak ejs sonrasında ise ilk parametre layout içerisinde çağırılacak demektir.
    res.render("forget_password", { layout: "./layout/auth_layout.ejs" });
  } catch (error) {
    console.log("We have an error", error);
    res.send({ ERROR: "WARN.! You got an error" + error.message });
  }
};

// CALL-BACKS FOR POSTS
const formRegister = (req, res, next) => {
  // console.log(req.body); // formdan gelen verileri almak için
  console.log("POST REGİSTER İÇİ");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("validation_errors", errors.array());
    req.flash("register_name", req.body.register_name);
    req.flash("register_surname", req.body.register_surname);
    req.flash("register_email", req.body.register_email);

    res.redirect("/register");
  } else {
    try {
      // burası layout ilk çalışacak ejs sonrasında ise ilk parametre layout içerisinde çağırılacak demektir.
      res.render("register", {
        layout: "./layout/auth_layout.ejs",
        registerErrors: errors,
      });
    } catch (error) {
      console.log("We have an error", error);
      res.send({ ERROR: "WARN.! You got an error" + error.message });
    }
  }
};

const formLogin = (req, res, next) => {
  console.log("Gelen Login verileri");
  console.log(req.body); // formdan gelen verileri almak için
  try {
    // burası layout ilk çalışacak ejs sonrasında ise ilk parametre layout içerisinde çağırılacak demektir.

    res.render("login", { layout: "./layout/auth_layout.ejs" });
  } catch (error) {
    console.log("We have an error", error);
    res.send({ ERROR: "WARN.! You got an error" + error.message });
  }
};

const formForgetPassword = (req, res, next) => {
  console.log(req.body);
  try {
    // burası layout ilk çalışacak ejs sonrasında ise ilk parametre layout içerisinde çağırılacak demektir.
    res.render("forget_password", { layout: "./layout/auth_layout.ejs" });
  } catch (error) {
    console.log("We have an error", error);
    res.send({ ERROR: "WARN.! You got an error" + error.message });
  }
};

module.exports = {
  loginPage,
  registerPage,
  homePage,
  forgetPassword,
  formRegister,
  formLogin,
  formForgetPassword,
};
