const { validationResult } = require("express-validator");
const User = require("../models/userModel");
const passport = require("passport");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

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

//Verify Email
const verifyEmail = (req, res, next) => {
  const token = req.query.id;

  if (token) {
    jwt.verify(
      token,
      process.env.CONFIRM_EMAIL_JWT_SECRET,
      async (err, decoded) => {
        if (err) {
          req.flash("error", "Kod Hatalı veya Süresi Geçmiş");
          res.redirect("/login"); //token bozulmuş veya süresi geçmişse
        } else {
          const tokenID = decoded.id;
          const result = await User.findByIdAndUpdate(tokenID, {
            emailActive: true,
          });
          if (result) {
            req.flash("success_message", [
              { msg: "Kullanıcı Başarı ile Kayedildi" },
            ]);
            res.redirect("/login");
          } else {
            req.flash("error", "Lütfen tekrar kullanıcı oluşturun");
            res.redirect("/register");
          }
        }
      }
    );
  } else {
    req.flash("error", "Lütfen tekrar kullanıcı oluşturun");
    res.redirect("/register");
  }
};

// get new password controller
const newPasswordForm = async (req, res, next) => {
  const urlID = req.params.id;
  const urlTOKEN = req.params.token;
  console.log(urlID);
  console.log(urlTOKEN);

  if (urlID && urlTOKEN) {
    const _findUser = await User.findOne({ _id: urlID });
    console.log("Bulunan Userrrsss:", _findUser);
    const secretKEY =
      process.env.RESET_EMAIL_JWT_SECRET + "-" + _findUser.password;
    try {
      jwt.verify(urlTOKEN, secretKEY, async (e, decoded) => {
        if (e) {
          req.flash("error", "Kod hatalı ve ya süresi geçmiş");
          res.redirect("/forget-password");
        } else {
          res.render("new_password", {
            id: urlID,
            token: urlTOKEN,
            layout: "./layout/auth_layout.ejs",
          });
        }
      });
    } catch (error) {
      req.flash("error", "Bir hata aldık " + error.message);
      res.redirect("/forget-password");
    }
  } else {
    req.flash("error", "Token yok lütfen mailinize bakınız..!");
    res.redirect("/forget-password");
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
      console.log("gelen user", _user);
      if (_user && _user.emailActive === true) {
        //burada user var ve email onaylanmış
        console.log("user var zaten");
        req.flash("validation_errors", [
          { msg: "Bu e-mail adresi başkası tarafından kullanılıyor.." },
        ]);
        req.flash("register_name", req.body.register_name);
        req.flash("register_surname", req.body.register_surname);
        req.flash("register_email", req.body.register_email);
        res.redirect("/register");
      } else if ((_user && _user.emailActive === false) || _user === null) {
        console.log("Bak buradayız işte ama...");
        if (!(_user === null)) {
          console.log("Buraya girdik", _user._id);
          await User.findByIdAndRemove({ _id: _user._id });
        }
        console.log("buraya giremedik");
        const newUser = new User({
          name: req.body.register_name,
          surname: req.body.register_surname,
          email: req.body.register_email,
          password: await bcrypt.hash(req.body.register_password, 10),
        });

        await newUser.save();
        console.log("Kullanıcı Kayedildi.");

        const jwtBilgileri = {
          id: newUser.id,
          email: newUser.email,
        };

        const jwtToken = jwt.sign(
          jwtBilgileri,
          process.env.CONFIRM_EMAIL_JWT_SECRET,
          { expiresIn: "1d" }
        );
        console.log(jwtToken);

        const url = process.env.WEB_SITE_URL + "verify?id=" + jwtToken;

        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD,
          },
        });

        await transporter.sendMail(
          {
            from: "NodeJS Uygulaması <info@nodecourse.com.tr",
            to: newUser.email,
            subject: "Mail Onaylama YK",
            text: "Lütfen mailinizi onaylamak için linke tıklayınız: " + url,
          },
          (error, info) => {
            if (error) {
              console.log("Bir hata oluştu.!");
            } else {
              console.log("E-mail gönderildi... :)");
              transporter.close();
            }
          }
        );

        req.flash("success_message", [
          { msg: "Lütfen e-mail kutunuzdan onaylayın" },
        ]);
        res.redirect("/login"); // kullanıcı kaydı başarılı ise login sayfasına gidecek
      }
      // burası layout ilk çalışacak ejs sonrasında ise ilk parametre layout içerisinde çağırılacak demektir.
    } catch (error) {
      console.log("We have an error :(", error);
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

const formForgetPassword = async (req, res, next) => {
  try {
    const _findUser = await User.findOne({ email: req.body.forget_email });
    console.log("Bulunan user:", _findUser);
    if (!_findUser) {
      // eğer kullanıcı bulunmadıysa
      console.log("Kullanıcımıızzzz yok");
      req.flash("error", "Kullanıcı bulunamadı..!");
      res.redirect("/forget-password");
    } else if (_findUser && _findUser.emailActive === false) {
      req.flash("error", "Emailinizi onaylayın.!");
      res.redirect("/login");
    } else if (_findUser && _findUser.emailActive === true) {
      req.flash("success_message", [{ msg: "Kullanıcı emaili bulundu..!" }]);
      //if there is a user, let's create jwt for repassword
      const jwtInfo = {
        id: _findUser.id,
        email: _findUser.email,
      };
      const secretKEY =
        process.env.RESET_EMAIL_JWT_SECRET + "-" + _findUser.password;
      const jwtToken = jwt.sign(jwtInfo, secretKEY, {
        expiresIn: "1d",
      });

      const url =
        process.env.WEB_SITE_URL +
        "newpassword/" +
        _findUser.id +
        "/" +
        jwtToken;

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD,
        },
      });

      await transporter.sendMail(
        {
          from: "NodeJS Uygulaması <info@nodecourse.com.tr",
          to: _findUser.email,
          subject: "Şifre Yenileme YK",
          text: "Lütfen şifre yenilemek için linke tıklayınız: " + url,
        },
        (error, info) => {
          if (error) {
            console.log("Bir hata oluştu.!");
          } else {
            console.log("E-mail gönderildi... :)");
            transporter.close();
          }
        }
      );

      console.log(jwtInfo);
      res.redirect("/login");
    } else {
      console.log("Nasıl yani");
      res.render("forget-password", { layout: "./layout/auth_layout.ejs" });
    }
  } catch (error) {
    console.log("We have an error", error);
    res.send({ ERROR: "WARN.! You got an error" + error.message });
  }
};

const saveNewPassword = async (req, res, next) => {
  console.log("Logunnnn içi");
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("hatanın içerisindeyiz...", errors);
      req.flash("validation_errors", errors.array());
      req.flash("new_password", req.body.new_password);
      req.flash("new_repassword", req.body.new_repassword);
      console.log(req.body.hidden_new_id);
      res.redirect(
        "/newpassword/" +
          req.body.hidden_new_id +
          "/" +
          req.body.hidden_new_token
      );
    }
    // burası layout ilk çalışacak ejs sonrasında ise ilk parametre layout içerisinde çağırılacak demektir.
    else {
      //yeni şifreyi kaydedelim
      const _findUser = await User.findOne({ _id: req.body.hidden_new_id });

      console.log("Yeni bulunan User:", _findUser);
      const secretKEY =
        process.env.RESET_EMAIL_JWT_SECRET + "-" + _findUser.password;
      try {
        jwt.verify(req.body.hidden_new_token, secretKEY, async (e, decoded) => {
          console.log(e);
          if (e) {
            req.flash("error", "Kod hatalı ve ya süresi geçmiş");
            res.redirect("/forget-password");
          } else {
            const hashedPassword = await bcrypt.hash(req.body.new_password, 10);
            const result = await User.findByIdAndUpdate(
              req.body.hidden_new_id,
              {
                password: hashedPassword,
              }
            );
            console.log("Bulunan User: ", result);
            if (result) {
              req.flash("success_message", [
                { msg: "Şifre Başarı ile Değiştirildi" },
              ]);

              res.redirect("/login");
            } else {
              req.flash("error", "Lütfen şifrenizi tekrar oluşturun");
              res.redirect(
                "/newpassword/" +
                  req.body.hidden_new_id +
                  "/" +
                  req.body.hidden_new_token
              );
            }
          }
        });
      } catch (error) {
        req.flash("error", "Bir hata aldık " + error);
        res.redirect(
          "/newpassword/" +
            req.body.hidden_new_id +
            "/" +
            req.body.hidden_new_token
        );
      }
    }

    //res.render("login", { layout: "./layout/auth_layout.ejs" });
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
  verifyEmail,
  newPasswordForm,
  saveNewPassword,
};
