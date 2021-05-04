const bcrypt = require('bcrypt')
const express = require('express')
const lists = express.Router()
const pool = require("../db")

const isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
        return next()
    } else {
        res.redirect('/sessions/login')
    }
}

lists.use(isAuthenticated)

lists.get('/followers/:username', isAuthenticated, async(req, res) => {
    try {
        const obtainingFollowersList = await pool.query("SELECT * FROM followers WHERE following = $1", [req.params.username])

        // console.log(obtainingFollowersList["rows"]);
        let followersList = []

        for (let follower of obtainingFollowersList["rows"]) {
            followersList.push(follower["username"])
        }

        ///query for all users
        const queryAllUsers = await pool.query("SELECT * FROM usernames;")
        let allUsersList = []
        for (let usernameEntry of queryAllUsers["rows"]) {
            if (usernameEntry["username"]!=req.session.currentUser[0]) {
                allUsersList.push(usernameEntry["username"])
            }
        }

        // console.log(followersList);
        res.render('followers.ejs', {
            followersList: followersList,
            username: req.params.username,
            allUsersList: allUsersList
        })
    } catch (err) {
        console.error(err.message)
    }
})

lists.get('/following/:username', isAuthenticated, async(req, res) => {
    try {
        const obtainingFollowingList = await pool.query("SELECT * FROM followers WHERE username = $1", [req.params.username])

        // console.log(obtainingFollowersList["rows"]);
        let followingList = []
        for (let user of obtainingFollowingList["rows"]) {
            followingList.push(user["following"])
        }

        ///query for all users
        const queryAllUsers = await pool.query("SELECT * FROM usernames;")
        let allUsersList = []
        for (let usernameEntry of queryAllUsers["rows"]) {
            if (usernameEntry["username"]!=req.session.currentUser[0]) {
                allUsersList.push(usernameEntry["username"])
            }
        }
        // console.log(followingList);
        res.render('following.ejs', {
            followingList: followingList,
            username: req.params.username,
            allUsersList: allUsersList
        })
    } catch (err) {
        console.error(err.message)
    }
})

module.exports = lists;
