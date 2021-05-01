const bcrypt = require('bcrypt')
const express = require('express')
const posts = express.Router()
const pool = require("../db")
require('dotenv').config();
const cloudinary = require("../cloudinary")
const fetch = require('node-fetch')
const axios = require('axios')

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

posts.get('/createv2', isAuthenticated, (req, res) => {
    res.render('createPostv2.ejs',
    {
        username:req.session.currentUser[0]
    })
})

posts.post('/create', isAuthenticated, async(req, res) => {
    try {


        let { description } = req.body
        let username = req.session.currentUser[0]
        let likes = 0


        let image = req.files.imgsrc.tempFilePath;



        let imageLink;
        // const newPost = await pool.query(
        //     "INSERT INTO posts (description, username, likes, image) VALUES($1,$2,$3,$4) RETURNING *", [description, username, likes, imageLink]
        // )


        cloudinary.uploader.upload(image, (result, error) => {
            if (result) {
                imageLink = result["url"]
                // console.log(description, username, likes, imageLink);
                const newPost = pool.query(
                    "INSERT INTO posts (description, username, likes, image) VALUES($1,$2,$3,$4) RETURNING *", [description, username, likes, imageLink]
                )

            } else {
                // console.log(error);
                console.log("this is error: ", error);
            }
        })


        res.redirect('/profile')
    } catch (err) {
        console.error(err.message);
    }
})

posts.post('/create/v2', isAuthenticated, async(req, res) => {
    try {
        let description = req.body.description
        let username = req.session.currentUser[0]
        let likes = 0

        //checks if the url is a jpeg,jpg,gif or png
        function checkURL(url) {
            return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
        }
        //creates randomimagelist to pick random images from (lorem ipsum site for images)
        let randomImageList = [];
        await axios.get('https://picsum.photos/v2/list?limit=100').then((response) => {
            for (let object of response["data"]) {
                randomImageList.push(object["url"])
            }
        }).catch((error) => {
            console.log(error);
        })

        let imageLink;
        const randomImage = 'https://picsum.photos/200/300?a'
        if (checkURL(req.body.image)) {
            console.log("image is good:", checkURL(req.body.image));
            imageLink = req.body.image
        } else {
            imageLink = randomImage
        }


        const newPost = pool.query(
            "INSERT INTO posts (description, username, likes, image) VALUES($1,$2,$3,$4) RETURNING *", [description, username, likes, imageLink]
        )



        res.redirect('/profile')
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
        // console.log(post);
        let allComments = []
        const queryComments = await pool.query("SELECT * FROM comments WHERE post_id = $1",[req.params.id])
        for (let entry of queryComments["rows"]) {
            allComments.push(entry)
        }
        // console.log(allComments);

        const queryCheckIfLiked = await pool.query("SELECT * FROM likes WHERE username = $1", [req.session.currentUser[0]])

        let allLikes = []

        for (let likeEntry of queryCheckIfLiked["rows"]) {
            allLikes.push(likeEntry["post_id"])
        }

        res.render('postPage.ejs',{
            post: post,
            allComments: allComments,
            allLikes: allLikes
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

        // console.log("post was updated");
        res.redirect('/profile');

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

        const deleteLikes = await pool.query("DELETE FROM likes WHERE post_id = $1", [id])

        const deleteComments = await pool.query("DELETE FROM comments WHERE post_id = $1", [id])

        res.redirect('/profile')
    }
    catch (err){
        console.error(err.message)
    }
})

module.exports = posts
