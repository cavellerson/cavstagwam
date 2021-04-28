const express = require('express');
const app = express();
const methodOverride = require('method-override')
const PORT = process.env.PORT || 3000;
const cors = require("cors");
const pool = require("./db")
const session = require('express-session')
// const cookieParser = require("cookieParser")
//
// require('dotenv').config()
app.use(cors());
app.use(express.json()); // allows access to req.body
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
// app.use(
// 	session({
// 		secret: process.env.SECRET,
// 		resave: false,
// 		saveUninitialized: false,
// 	})
// )

// app.use(express.cookieParser(process.env.SECRET));
// app.use(express.session());

app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: false,
	})
)

const postsController = require('./controllers/posts_controller.js')
app.use('/posts', postsController)

const usersController = require('./controllers/users_controller.js')
app.use('/users', usersController)

const sessionsController = require('./controllers/sessions_controller.js')
app.use('/sessions', sessionsController)

const followersController = require('./controllers/following_controller.js')
app.use('/follow', followersController)

const unfollowsController = require('./controllers/unfollow_controller.js')
app.use('/unfollow', unfollowsController)

const feedsController = require('./controllers/feed_controller.js')
app.use('/feed', feedsController)

const listsController = require('./controllers/list_controller.js')
app.use('/list', listsController)

const commentsController = require('./controllers/comments_controller.js')
app.use('/comments', commentsController)

app.get('/', (req, res) => {
	res.redirect('/sessions/login')
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
