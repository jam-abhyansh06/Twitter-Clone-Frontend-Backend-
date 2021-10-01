const express = require("express")
const app = express()

app.set("view engine", "pug");
app.set("views", "views");

app.get("/", (req, res, next) => {

  let payload ={
    pageTitle:"Home"
  }

  res.status(200).render("home", payload)
})











app.listen(3000, () => console.log("Server running on Port 3000"))
