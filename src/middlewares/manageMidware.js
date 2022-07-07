const sessionRight = function (req, res, next) {
  if (req.isAuthenticated()) {
    // Authenticate sağlanmışsa yani doğru giriş yapıldıysa
    return next();
  } else {
    req.flash("error", ["Lütfen önce oturum açınız..!"]);
    res.redirect("/login");
  }
};

module.exports = { sessionRight };
