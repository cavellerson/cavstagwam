const express = require('express')
const searchUsers = express.Router()
const pool = require('../db')

const isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
        return next()
    } else {
        res.redirect('/sessions/login')
    }
}

searchUsers.use(isAuthenticated)



searchUsers.post('/', isAuthenticated, (req, res) => {
    // console.log(req.body.searchInput);
    res.redirect(`/${req.body.searchInput}`)
})
module.exports = searchUsers;
