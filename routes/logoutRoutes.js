const express = require("express")
const bodyParser = require("body-parser");

const app = express()

app.use(bodyParser.urlencoded({extended: true}))

const router = express.Router()


router.get("/", (req, res, next) => {

  if(req.session) {
      req.session.destroy(() => {
          res.redirect("/login")
      })
  }
  
})

module.exports = router;