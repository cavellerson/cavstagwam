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
        // console.log(followersList);

        const queryAllUsers = await pool.query("SELECT * FROM usernames;")
        let allUsersList = []
        for (let usernameEntry of queryAllUsers["rows"]) {
            if (usernameEntry["username"]!=req.session.currentUser[0]) {
                allUsersList.push(usernameEntry["username"])
            }
        }

        //queries for all notifications
        const queryForAllNotifications = await pool.query("SELECT * FROM notifications WHERE username = $1 ORDER BY notification_id DESC", [req.session.currentUser[0]])
        // console.log(queryForAllNotifications["rows"]);
        let allNotifications = []

        for (let entry of queryForAllNotifications["rows"]) {
            allNotifications.push(entry)
        }

        // get images for notifications
        const queryForNotificationThumbnails = await pool.query("SELECT * FROM posts WHERE username = $1", [req.session.currentUser[0]])

        let thumbnailLinks = []
        for (let query of queryForNotificationThumbnails["rows"]) {
            thumbnailLinks.push({post_id:query.post_id,image:query.image})
        }

        res.render('followers.ejs', {
            followersList: followersList,
            username: req.params.username,
            allUsersList: allUsersList,
            allNotifications: allNotifications,
            thumbnailLinks: thumbnailLinks
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
        // console.log(followingList);

        const queryAllUsers = await pool.query("SELECT * FROM usernames;")
        let allUsersList = []
        for (let usernameEntry of queryAllUsers["rows"]) {
            if (usernameEntry["username"]!=req.session.currentUser[0]) {
                allUsersList.push(usernameEntry["username"])
            }
        }

        //queries for all notifications
        const queryForAllNotifications = await pool.query("SELECT * FROM notifications WHERE username = $1 ORDER BY notification_id DESC", [req.session.currentUser[0]])
        // console.log(queryForAllNotifications["rows"]);
        let allNotifications = []

        for (let entry of queryForAllNotifications["rows"]) {
            allNotifications.push(entry)
        }

        // get images for notifications
        const queryForNotificationThumbnails = await pool.query("SELECT * FROM posts WHERE username = $1", [req.session.currentUser[0]])

        let thumbnailLinks = []
        for (let query of queryForNotificationThumbnails["rows"]) {
            thumbnailLinks.push({post_id:query.post_id,image:query.image})
        }

        res.render('following.ejs', {
            followingList: followingList,
            username: req.params.username,
            allUsersList: allUsersList,
            allNotifications: allNotifications,
            thumbnailLinks
        })
    } catch (err) {
        console.error(err.message)
    }
})

module.exports = lists;
