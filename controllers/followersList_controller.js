const bcrypt = require('bcrypt')
const express = require('express')
const followingUserList = express.Router()
const pool = require("../db")

const isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
        return next()
    } else {
        res.redirect('/sessions/login')
    }
}

followingUserList.use(isAuthenticated)


followingUserList.get('/following/:username', isAuthenticated, async(req, res) => {
    try {
        const obtainingFollowersList = await pool.query("SELECT * FROM followers WHERE username = $1", [req.params.username])

        // console.log(obtainingFollowersList["rows"]);
        let followerList = []
        for (let user of obtainingFollowersList["rows"]) {
            followerList.push(user["following"])
        }
        console.log(followerList);
        res.render('following.ejs', {
            followerList: followerList,
            currentUser: req.session.currentUser[0]
        })
    } catch (err) {
        console.error(err.message)
    }
})

module.exports = followingUserList;
