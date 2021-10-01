const express = require("express")
const app = express()

const middleware = require("./middleware")

const path = require("path")

app.set("view engine", "pug");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));

// Routes
const loginRoute = require("./routes/loginRoutes")

app.use(loginRoute)

app.get("/", middleware.requireLogin, (req, res, next) => {

  let payload ={
    pageTitle:"Home"
  }

  res.status(200).render("home", payload)
})











app.listen(3000, () => console.log("Server running on Port 3000"))
