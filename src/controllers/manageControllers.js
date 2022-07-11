const showAdminPanel = function (req, res, next) {
  res.render("index", { layout: "./layout/admin_layout.ejs" });
};

const showProfilePanel = (req, res, next) => {
  console.log(req.user); // buradaki req.user aslında passportJS den deserialize yapılan yerden gönderilen user --> configs/passportLocal
  res.render("profile", { layout: "./layout/admin_layout.ejs" });
};

module.exports = {
  showAdminPanel,
  showProfilePanel,
};
