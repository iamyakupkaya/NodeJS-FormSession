// Import İn-Builds
const dotenv = require("dotenv").config(); // config dememizin sebebsi proccess.env dediğimizde direkt ulaşabilmek
const express = require("express");
const ejs = require("ejs");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
// İmport User-Build
require("./src/configs/database"); // database connection
const appRouter = require("./src/routers/appRouter");

const app = express(); // expressi başlatalım

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

//ROUTERS
app.use("/", appRouter);

/* app.get("/login", loginPage);

app.get("/register", registerPage); */

//POSTs

//Listen...
app.listen(process.env.PORT, (_) =>
  console.log("Server is listening... Connection right :)")
);
