const bcrypt = require('bcrypt')
const express = require('express')
const posts = express.Router()
const pool = require("../db")

const isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
        return next()
    } else {
        res.redirect('/sessions/login')
    }
}

posts.use(isAuthenticated)

//create a posts
posts.get('/create', isAuthenticated, (req, res) => {
    // console.log(req.body.username);
    res.render('createPost.ejs',
    {
        username: req.session.currentUser[0]
    })
})
posts.post('/create', isAuthenticated, async(req, res) => {
    try {

        let { description } = req.body
        let username = req.session.currentUser[0]
        let likes = 0
        let { image } = req.body
        // console.log(`req.body: ${JSON.stringify(req.body)}`);
        const newPost = await pool.query(
            "INSERT INTO posts (description, username, likes, image) VALUES($1,$2,$3,$4) RETURNING *", [description, username, likes, image]
        )
        // res.json(newPost.rows[0])

        // console.log(req.body.username, description, likes, image);

        res.redirect('/posts')
    } catch (err) {
        console.error(err.message);
    }
})

// get all posts
posts.get('/', isAuthenticated, async(req, res) => {
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
        res.render('home.ejs', {
            allPosts: allPosts,
            username: req.session.currentUser[0],
            allUsernames: allUsernames
        })
    }
    catch (err) {
        console.error(err.message);
    }

})

posts.get(`/:username`, isAuthenticated, async(req, res) => {
    try {
        const queryData = await pool.query("SELECT * FROM posts WHERE username = $1",[req.params.username])

        let allPosts = queryData["rows"]
        // console.log(allPosts);
        // console.log(req.session.currentUser[0]);

        res.render('userProfile.ejs', {
            username: req.params.username,
            allPosts,
            currentUser: req.session.currentUser[0],

        })
    } catch (err) {
        console.error(err.message)
    }
})

// view a post by post_id

posts.get('/:username/:id', isAuthenticated, async(req, res) => {
    try {
        const postID = req.params.id
        const queryData = await pool.query("SELECT * FROM posts WHERE post_id = $1", [postID])
        // console.log(queryData);
        const post = queryData["rows"][0]
        console.log(post);
        res.render('postPage.ejs',{
            post: post
        })
    } catch (err) {
        console.error(err.message)
    }
})

//shows the page to edit the post
posts.get('/:username/:id/edit', isAuthenticated, async(req, res) => {
    try {
        const postID = req.params.id
        const queryData = await pool.query("SELECT * FROM posts WHERE post_id = $1", [postID])
        // console.log(req.session.currentUser);
        // console.log(queryData);
        const post = queryData["rows"][0]
        // console.log(post);
        if (req.params.username === req.session.currentUser[0]) {
            res.render('editPost.ejs',{
                post: post
            })
        } else {
            res.send("<h1> you don't have permission to update</h1>")
        }

    } catch (err) {
        console.error(err.message)
    }
})

// update/edit a post
posts.put('/:id', isAuthenticated, async(req, res) => {
    try {
        const id = req.params.id
        const description = req.body.description
        const updatePost = await pool.query("UPDATE posts SET description = $1 WHERE post_id = $2", [description, id])
        console.log("post was updated");
        res.redirect('/posts')
    }
    catch (err) {
        console.error(message)
    }
})



// delete a post
posts.delete('/:id', isAuthenticated, async(req, res) => {
    try {
        const { id } = req.params;
        const deletePost = await pool.query("DELETE FROM posts WHERE post_id = $1", [id])
        res.json("Post was deleted")
    }
    catch (err){
        console.error(err.message)
    }
})

module.exports = posts
