// Import İn-Builds
const dotenv = require("dotenv").config(); // config dememizin sebebsi proccess.env dediğimizde direkt ulaşabilmek
const express = require("express");
const ejs = require("ejs");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");
const MongoDBStore = require("connect-mongodb-session")(session); //yukarıda oluşturduğumuz session ı yolluyoruz. express session dan oluşturduğumuz session
const path = require("path");

// İmport User-Build
require("./src/configs/database"); // database connection
const appRouter = require("./src/routers/appRouter");

const app = express(); // expressi başlatalım

//session save on database
const sessionStore = new MongoDBStore({
  uri: process.env.MONGODB_CONNECTION_STRING,
  collection: "sessions",
});

//view engine ejs olarak ayarlayalım
//SETs
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./src/views")); //views olarak arayacak dosyanın yeni yolunu belirtiyoruz | views kalsöürün src altındaki views klasöürü olacak

//USEs
app.use(expressLayouts);
app.use(express.static("public"));
//formdan gelen değerleri alabilmek için
app.use(express.urlencoded({ extended: true }));
//verileri jsondan alabilmek için
app.use(express.json());

//session ve flash message
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      //maxAge: 5000, // her 5 saniyede bir cookie değişecek
      maxAge: 1000 * 60 * 60 * 60 * 24, // bu 24 saatte bir cookie değişecek demektir. eskisi silinip yerine yenisi verilecek
    },
    store: sessionStore, // session oluşturulurken bunu kaydedeceğin yer
  })
);
console.log("flash öncesi");
app.use(flash());
console.log("flash sonrası");
app.use((req, res, next) => {
  console.log("Birinci middle ware");
  //res.locals yaparak req gelen değeri response ekliyoruz daha sonra bunu render ettiğimiz sayfaya otomatik giden response da kullanıyoruz
  res.locals.validation_errors = req.flash("validation_errors");
  res.locals.register_name = req.flash("register_name");
  res.locals.register_surname = req.flash("register_surname");
  res.locals.register_email = req.flash("register_email");

  next();
});
//Get Post vb işlemlerde her zaman olan tüm middlewareler çalışır
app.use((req, res, next) => {
  console.log("İkinci middleware");
  next();
});
console.log("middleware sonrası");

//ROUTERS
app.use("/", appRouter);

/* app.get("/login", loginPage);

app.get("/register", registerPage); */

//POSTs

//Listen...
app.listen(process.env.PORT, (_) =>
  console.log("Server is listening... Connection right :)")
);
