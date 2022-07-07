const { validationResult } = require("express-validator");
const User = require("../models/userModel");
const passport = require("passport");

require("../configs/passportLocal")(passport);

const homePage = (req, res, next) => {
  if (req.session.sayac) {
    req.session.sayac++;
  } else {
    req.session.sayac = 1;
  }
  console.log(req.user);

  try {
    // burası layout ilk çalışacak ejs sonrasında ise ilk parametre layout içerisinde çağırılacak demektir.
    res.render("home", {
      layout: "./layout/auth_layout.ejs", // layout özel kalasördür
      sayac: req.session.sayac,
      user: req.user,
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

const logoutPage = (req, res, next) => {
  try {
    // burası layout ilk çalışacak ejs sonrasında ise ilk parametre layout içerisinde çağırılacak demektir.
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.session.destroy((err) => {
        next(err);
      });
      res.render("login", {
        layout: "./layout/auth_layout.ejs",
        success_message: [{ msg: "Oturum başarı ile kapandı." }],
      });
    });
  } catch (error) {
    res.send({ ERROR: "WARN.! You got an error :( " + error.message });
  }
};

// CALL-BACKS FOR POSTS
const formRegister = async (req, res, next) => {
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
      const _user = await User.findOne({ email: req.body.register_email });
      if (_user) {
        console.log("user var zaten");
        req.flash("validation_errors", [
          { msg: "Bu e-mail adresi başkası tarafından kullanılıyor.." },
        ]);
        req.flash("register_name", req.body.register_name);
        req.flash("register_surname", req.body.register_surname);
        req.flash("register_email", req.body.register_email);
        res.redirect("/register");
      } else {
        const newUser = new User({
          name: req.body.register_name,
          surname: req.body.register_surname,
          email: req.body.register_email,
          password: req.body.register_password,
        });

        await newUser.save();
        console.log("Kullanıcı Kayedildi.");
        req.flash("success_message", [
          { msg: "Kullanıcı başarı ile kayedildi.. :)" },
        ]);
        res.redirect("/login"); // kullanıcı kaydı başarılı ise login sayfasına gidecek
      }
      // burası layout ilk çalışacak ejs sonrasında ise ilk parametre layout içerisinde çağırılacak demektir.
    } catch (error) {
      console.log("We have an error", error);
      res.send({ ERROR: "WARN.! You got an error" + error.message });
    }
  }
};

const formLogin = (req, res, next) => {
  /* console.log("Gelen Login verileri");
  console.log(req.body); // formdan gelen verileri almak için */
  try {
    const errors = validationResult(req);
    req.flash("login_email", req.body.login_email);

    if (!errors.isEmpty()) {
      req.flash("validation_errors", errors.array());
      console.log("Çalışan yer burası İF");
      res.redirect("/login");
    }
    // burası layout ilk çalışacak ejs sonrasında ise ilk parametre layout içerisinde çağırılacak demektir.
    else {
      passport.authenticate("local", {
        successRedirect: "/admin",
        failureRedirect: "/login",
        failureFlash: true,
      })(req, res, next);
    }

    //res.render("login", { layout: "./layout/auth_layout.ejs" });
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
  logoutPage,
};
