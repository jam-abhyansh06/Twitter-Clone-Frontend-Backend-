const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const session = require("express-session")
const middleware = require("./middleware")
const mongoose = require("./Database")

const app = express()

app.set("view engine", "pug");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({extended: true}))

app.use(session({
  secret: process.env.sessionSecret,
  resave: true,
  saveUninitialized: false
}))

// Routes
const loginRoute = require("./routes/loginRoutes")
const registerRoute = require("./routes/registerRoutes")
const logoutRoute = require("./routes/logoutRoutes")

// API Routes
const apiPostsRoute = require("./routes/api/posts")

app.use("/login",loginRoute)
app.use("/register",registerRoute)
app.use("/logout",logoutRoute)
app.use("/api/posts",apiPostsRoute)


app.get("/", middleware.requireLogin, (req, res, next) => {

  let payload ={
    pageTitle:"Home",
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
  }

  res.status(200).render("home", payload)
})











app.listen(3000, () => console.log("Server running on Port 3000"))
