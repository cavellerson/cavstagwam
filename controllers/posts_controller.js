const bcrypt = require('bcrypt')
const express = require('express')
const posts = express.Router()
const pool = require("../db")

const isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
        return next()
    } else {
        res.redirect('/sessions/new')
    }
}

posts.use(isAuthenticated)

//create a posts
posts.get('/create', isAuthenticated, (req, res) => {
    console.log(req.body.username);
    res.render('createPost.ejs',
    {
        username: req.session.currentUser[0]
    })
})
posts.post('/create', isAuthenticated, async(req, res) => {
    try {

        let { description } = req.body
        let { username } = req.session.currentUser[0]
        let { likes } = 0
        let { image } = req.body
        console.log(`req.body: ${JSON.stringify(req.body)}`);
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
        // console.log(post.rows);
        console.log(req.session.currentUser[0]);
        res.render('home.ejs', {
            allPosts: post.rows,
            username: req.session.currentUser[0]
        })
    }
    catch (err) {
        console.error(err.message);
    }

})

// update a post
posts.put('/:id', isAuthenticated, async(req, res) => {
    try {
        const { id } = req.params
        const { description } = req.body
        const updatePost = await pool.query("UPDATE posts SET description = $1 WHERE post_id = $2", [description, id])
        res.json("Post was updated")
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
