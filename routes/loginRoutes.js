const express = require("express")
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("../schemas/UserSchema");

const app = express()

app.use(bodyParser.urlencoded({extended: true}))

const router = express.Router()

app.set("view engine", "pug");
app.set("views", "views");

router.get("/", (req, res, next) => {

  res.status(200).render("login");
  
})

router.post("/", async (req, res, next) => {


  let payload = req.body;
  payload.logUsername = payload.logUsername.trim()

  if(req.body.logUsername.trim() && req.body.logPassword) {
      let user = await User.findOne({
        $or: [
          {username: req.body.logUsername},
          {email: req.body.logUsername}
        ]
      })
      .catch((err) => {
        console.log(err);
        payload.errorMessage = "Something went wrong."
        res.status(200).render("login", payload);
    });

    if(user !== null) {

      let result = await bcrypt.compare(req.body.logPassword, user.password);

      if(result) {
        req.session.user = user;
        return res.redirect("/");
      }
    }

    
    payload.errorMessage = "Login credentials incorrect."
    return res.status(200).render("login", payload)
  }

  payload.errorMessage = "Make sure each field has a valid value."
  res.status(200).render("login",payload);
  
})

module.exports = router;