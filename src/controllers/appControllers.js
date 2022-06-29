const homePage = (req, res, next) => {
  try {
    // burası layout ilk çalışacak ejs sonrasında ise ilk parametre layout içerisinde çağırılacak demektir.
    res.render("home", { layout: "./layout/auth_layout.ejs" });
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
  try {
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
  console.log(req.body); // formdan gelen verileri almak için
  try {
    // burası layout ilk çalışacak ejs sonrasında ise ilk parametre layout içerisinde çağırılacak demektir.
    res.render("register", { layout: "./layout/auth_layout.ejs" });
  } catch (error) {
    console.log("We have an error", error);
    res.send({ ERROR: "WARN.! You got an error" + error.message });
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
