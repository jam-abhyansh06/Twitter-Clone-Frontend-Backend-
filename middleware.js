exports.requireLogin = (req, res, next) => {
    if(req.session && req.session.user) {
        res.next();
    }
    else {
        res.redirect("/login");
    }
}