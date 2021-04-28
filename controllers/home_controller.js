const express = require('express')
const home = express.Router()
const pool = require("../db")

const isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
        return next()
    } else {
        res.redirect('/sessions/login')
    }
}

home.use(isAuthenticated)
// get all posts
home.get('/explore', isAuthenticated, async(req, res) => {
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

home.get('/profile', isAuthenticated, (req, res) => {
    let currentUser = req.session.currentUser[0]
    res.redirect(`/${currentUser}`)
})

//shows user profile
home.get(`/:username`, isAuthenticated, async(req, res) => {
    try {
        const queryData = await pool.query("SELECT * FROM posts WHERE username = $1",[req.params.username])

        let allPosts = queryData["rows"]
        // console.log(allPosts);
        // console.log(req.session.currentUser[0]);
        const checkIfFollowed = await pool.query("SELECT * FROM followers WHERE username=$1 AND following = $2", [req.session.currentUser[0], req.params.username])
        // console.log(checkIfFollowed["rows"]);
        // 0 render follow button
        // 1 render unfollow button
        // 2 render nothing
        let whichButtonToRender;
        if (req.session.currentUser[0] === req.params.username) {
            whichButtonToRender = 2;
        } else if (checkIfFollowed["rows"].length > 0) {
            whichButtonToRender = 1;
        } else if (checkIfFollowed["rows"].length === 0) {
            whichButtonToRender = 0;
        }

        // checks how many people the user is following

        // const obtainingFollowingList = await pool.query("SELECT * FROM followers WHERE username = $1", [req.params.username])
        //
        // let followingList = [];
        // for (let user of obtainingFollowingList) {
        //     followingList.push(user["following"])
        // }




        res.render('userProfile.ejs', {
            username: req.params.username,
            allPosts,
            currentUser: req.session.currentUser[0],
            whichButtonToRender: whichButtonToRender

        })
    } catch (err) {
        console.error(err.message)
    }
})

// get your feed depending on the users you're following
home.get('/', isAuthenticated, async(req, res) => {
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




module.exports = home;
