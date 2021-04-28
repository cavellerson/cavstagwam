const bcrypt = require('bcrypt')
const express = require('express')
const feeds = express.Router()
const pool = require("../db")

const isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
        return next()
    } else {
        res.redirect('/sessions/login')
    }
}

feeds.use(isAuthenticated)







module.exports = feeds;
