const express = require("express")
const middleware = require("./middleware")
const path = require("path")
const bodyParser = require("body-parser")
const mongoose = require("./Database")

const app = express()

app.set("view engine", "pug");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({extended: true}))


// Routes
const loginRoute = require("./routes/loginRoutes")
const registerRoute = require("./routes/registerRoutes")

app.use("/login",loginRoute)
app.use("/register",registerRoute)


app.get("/", middleware.requireLogin, (req, res, next) => {

  let payload ={
    pageTitle:"Home"
  }

  res.status(200).render("home", payload)
})











app.listen(3000, () => console.log("Server running on Port 3000"))
