const express = require('express');
const app = express();
const methodOverride = require('method-override')
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const pool = require("./db")
const session = require('express-session')
const fileUpload = require('express-fileupload');


app.use(cors());
app.use(express.json()); // allows access to req.body
app.use(express.static('public'))
app.use(methodOverride('_method'))

app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: false,
	})
)
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

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

const listsController = require('./controllers/lists_controller.js')
app.use('/list', listsController)

const commentsController = require('./controllers/comments_controller.js')
app.use('/comments', commentsController)

const homeController = require('./controllers/home_controller.js')
app.use('', homeController)

const likesController = require('./controllers/likes_controller.js')
app.use('/action', likesController)

const searchUsersController = require('./controllers/searchUsers_controller.js')
app.use('/search', searchUsersController)

// const psqlController = require('./controllers/psql_clean.js')
// app.use('/psql/clean/up/test', psqlController)





app.get('/', (req, res) => {
	res.redirect('/sessions/login')
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
