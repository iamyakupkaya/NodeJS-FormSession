const { body } = require("express-validator");

const registerUser = function () {
  return [
    body("register_email")
      .trim()
      .isEmail()
      .withMessage("Lütfen geçerli e-mail giriniz.."),

    body("register_name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Minimum 2 karakter...")
      .isLength({ max: 30 })
      .withMessage("Maximum 30 karakter..."),

    body("register_password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Minimum 8 karakter...")
      .isLength({ max: 30 })
      .withMessage("Maximum 30 karakter..."),

    body("register_repassword")
      .trim()
      .custom((value, { req }) => {
        //value inputa girilen değerdir
        if (value !== req.body.register_password) {
          throw new Error("Şifreler aynı değil");
        }
      }),
  ];
};

module.exports = {
  registerUser,
};
