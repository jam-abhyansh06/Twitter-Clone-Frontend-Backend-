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


// Normal Routes
const loginRoute = require("./routes/loginRoutes")
const registerRoute = require("./routes/registerRoutes")
const logoutRoute = require("./routes/logoutRoutes")
const postRoute = require("./routes/postRoutes")
const profileRoute = require("./routes/profileRoutes")
const uploadRoute = require("./routes/uploadRoutes")


app.use("/login",loginRoute)
app.use("/register",registerRoute)
app.use("/logout",logoutRoute)
app.use("/posts", middleware.requireLogin, postRoute)
app.use("/profile", middleware.requireLogin, profileRoute)
app.use("/uploads", uploadRoute)



// API Routes
const apiPostsRoute = require("./routes/api/posts")
const apiUsersRoute = require("./routes/api/users")

app.use("/api/posts",apiPostsRoute)
app.use("/api/users",apiUsersRoute)




app.get("/", middleware.requireLogin, (req, res, next) => {

  let payload ={
    pageTitle:"Home",
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
  }

  res.status(200).render("home", payload)
})











app.listen(3000, () => console.log("Server running on Port 3000"))
