const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/userModel");

module.exports = function (passport) {
  const options = {
    usernameField: "login_email",
    passwordField: "login_password",
  };
  console.log("Pass sayfa");
  passport.use(
    new LocalStrategy(options, async (login_email, login_password, done) => {
      const _findUser = await User.findOne({ email: login_email });
      console.log("NEREDEEEE");
      console.log(_findUser);
      try {
        if (!_findUser) {
          // if there is no user
          return done(null, false, { message: "User could not find" });
        }

        if (_findUser.password !== login_password) {
          return done(null, false, { message: "Password is wrong" });
        } else {
          return done(null, _findUser);
        }
      } catch (error) {
        return done(err);
      }
    })
  );

  passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
      cb(null, { id: user.id});
    });
  });

  passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });
};
