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

// get your feed depending on the users you're following

feeds.get('/home', isAuthenticated, async(req, res) => {
    try {
        const queryFeedPosts = await pool.query("SELECT * FROM followers WHERE username = $1", [req.session.currentUser[0]])
        // console.log(queryFeedPosts["rows"]);
        let posts = [];

        for (let rowData of queryFeedPosts["rows"]) {

            const followedPost = await pool.query("SELECT * FROM posts WHERE username = $1", [rowData["following"]])

            // console.log(followedPost);
            // console.log(rowData["following"]);
            // console.log(followedPost["rows"]);
            // posts.push(followedPost["rows"])
            for (let post of followedPost["rows"]) {
                posts.push(post)
            }
            // posts.push(followedPost["rows"])

        }
        res.render('homeFeed.ejs', {
            posts: posts
        })


    } catch (err) {
        console.error(err.message)
    }
})

// get all posts
feeds.get('/explore', isAuthenticated, async(req, res) => {
    try {
        const post = await pool.query("SELECT * FROM posts;")

        let allPosts = post.rows.reverse();
        // console.log(allPosts);
        // console.log(req.session.currentUser[0]);
        const queryUsersData = await pool.query("SELECT * FROM usernames;")
        // console.log(queryUsersData["rows"]);
        let allUsernames = []
        for (let index in queryUsersData["rows"]) {
            // allUsernames.push(queryUsersData["rows"][index]["username"])
            allUsernames.push(queryUsersData["rows"][index]["username"])
        }
        // console.log("allusernames: ", allUsernames);
        res.render('explore.ejs', {
            allPosts: allPosts,
            username: req.session.currentUser[0],
            allUsernames: allUsernames
        })
    }
    catch (err) {
        console.error(err.message);
    }

})

module.exports = feeds;
